/**
 * Seeder para registros financeiros
 * 
 * Este script popula a tabela de registros financeiros com dados de exemplo.
 * 
 * @author Doc.AI Team
 */

const { v4: uuidv4 } = require('uuid');
const { User, Document, FinancialRecord } = require('../../models');
const { faker } = require('@faker-js/faker/locale/pt_BR');

const createFinancialRecords = async () => {
  try {
    // Buscar usuários com papel 'user'
    const users = await User.findAll({ where: { role: 'user' } });
    
    if (users.length === 0) {
      console.log('Nenhum usuário encontrado para criar registros financeiros');
      return;
    }

    // Categorias financeiras
    const financialCategories = [
      'alimentacao', 'transporte', 'moradia', 'saude', 'educacao', 
      'lazer', 'vestuario', 'utilidades', 'investimentos', 'outros'
    ];
    
    // Estabelecimentos por categoria
    const establishmentsByCategory = {
      alimentacao: ['Supermercado Extra', 'Pão de Açúcar', 'Restaurante Bom Prato', 'Padaria São Paulo', 'Mercado Municipal'],
      transporte: ['Posto Shell', 'Posto Ipiranga', 'Uber', '99 Táxi', 'Metrô São Paulo'],
      moradia: ['Condomínio', 'SABESP', 'ENEL', 'Comgás', 'NET'],
      saude: ['Drogaria São Paulo', 'Drogasil', 'Hospital Albert Einstein', 'Clínica São Luiz', 'Academia Smart Fit'],
      educacao: ['Universidade de São Paulo', 'Curso de Inglês', 'Livraria Cultura', 'Escola Técnica', 'Papelaria'],
      lazer: ['Cinema Cinemark', 'Teatro Municipal', 'Parque Villa-Lobos', 'Netflix', 'Spotify'],
      vestuario: ['C&A', 'Renner', 'Riachuelo', 'Centauro', 'Netshoes'],
      utilidades: ['Casas Bahia', 'Magazine Luiza', 'Ponto Frio', 'Fast Shop', 'Americanas'],
      investimentos: ['Banco Itaú', 'Banco do Brasil', 'Nubank', 'XP Investimentos', 'BTG Pactual'],
      outros: ['Amazon', 'iFood', 'Rappi', 'Mercado Livre', 'AliExpress']
    };

    // Para cada usuário, criar documentos financeiros e registros financeiros
    for (const user of users) {
      // Criar documentos financeiros
      const documentTypes = ['fatura', 'nota_fiscal', 'cupom_fiscal', 'extrato_bancario', 'comprovante_pagamento', 'recibo'];
      const documents = [];

      for (let i = 0; i < 20; i++) {
        const documentType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
        const category = financialCategories[Math.floor(Math.random() * financialCategories.length)];
        const establishment = establishmentsByCategory[category][Math.floor(Math.random() * establishmentsByCategory[category].length)];
        
        const transactionDate = faker.date.between({ 
          from: new Date(new Date().setFullYear(new Date().getFullYear() - 1)), 
          to: new Date() 
        });
        
        const amount = faker.number.float({ min: 10, max: 1000, precision: 0.01 });
        
        const document = await Document.create({
          id: uuidv4(),
          userId: user.id,
          title: `${documentType.charAt(0).toUpperCase() + documentType.slice(1)} - ${establishment}`,
          description: `${category.charAt(0).toUpperCase() + category.slice(1)} - R$ ${amount.toFixed(2)}`,
          category: 'financial',
          tags: [documentType, category],
          filePath: `/uploads/${uuidv4()}.pdf`,
          fileType: 'application/pdf',
          fileSize: faker.number.int({ min: 50000, max: 2000000 }),
          contentText: faker.lorem.paragraphs(2),
          aiProcessed: true,
          aiSummary: `Compra em ${establishment} no valor de R$ ${amount.toFixed(2)} em ${transactionDate.toLocaleDateString('pt-BR')}`,
          aiEntities: {
            establishment,
            amount,
            date: transactionDate.toISOString(),
            category,
            paymentMethod: faker.helpers.arrayElement(['Cartão de Crédito', 'Cartão de Débito', 'Dinheiro', 'PIX', 'Boleto'])
          },
          aiCategories: ['financial', category],
          createdAt: transactionDate,
          updatedAt: faker.date.recent()
        });
        
        documents.push(document);
      }

      // Criar registros financeiros baseados nos documentos
      for (const document of documents) {
        const recordType = document.tags[0];
        const category = document.tags[1];
        const transactionDate = new Date(document.aiEntities.date);
        const establishment = document.aiEntities.establishment;
        const amount = document.aiEntities.amount;
        const paymentMethod = document.aiEntities.paymentMethod;
        
        // Dados específicos para cada tipo de registro
        let items = [];
        let taxes = {};
        
        // Nota fiscal ou cupom fiscal
        if (recordType === 'nota_fiscal' || recordType === 'cupom_fiscal') {
          const numItems = faker.number.int({ min: 1, max: 5 });
          let totalItems = 0;
          
          for (let i = 0; i < numItems; i++) {
            const itemAmount = faker.number.float({ min: 5, max: amount / 2, precision: 0.01 });
            const quantity = faker.number.int({ min: 1, max: 5 });
            const itemTotal = itemAmount * quantity;
            totalItems += itemTotal;
            
            items.push({
              nome: faker.commerce.productName(),
              quantidade: quantity,
              valorUnitario: itemAmount,
              valorTotal: itemTotal
            });
          }
          
          // Ajustar o último item para que a soma bata com o total
          if (items.length > 0) {
            const diff = amount - totalItems;
            items[items.length - 1].valorTotal += diff;
            items[items.length - 1].valorUnitario = items[items.length - 1].valorTotal / items[items.length - 1].quantidade;
          }
          
          // Impostos
          taxes = {
            icms: faker.number.float({ min: 1, max: amount * 0.17, precision: 0.01 }),
            iss: faker.number.float({ min: 0.5, max: amount * 0.05, precision: 0.01 }),
            pis: faker.number.float({ min: 0.1, max: amount * 0.0165, precision: 0.01 })
          };
        }
        
        // Determinar se é despesa ou receita
        const isExpense = faker.datatype.boolean(0.8); // 80% de chance de ser despesa
        
        // Determinar se é recorrente
        const isRecurring = faker.datatype.boolean(0.3); // 30% de chance de ser recorrente
        
        // Criar o registro financeiro
        await FinancialRecord.create({
          id: uuidv4(),
          documentId: document.id,
          userId: user.id,
          recordType,
          transactionDate,
          amount: isExpense ? amount : amount * -1, // Negativo para receitas
          currency: 'BRL',
          description: document.description,
          category,
          subcategory: faker.helpers.maybe(() => faker.commerce.department()),
          paymentMethod,
          establishment,
          cnpj: faker.helpers.maybe(() => faker.number.int({ min: 10000000000000, max: 99999999999999 }).toString()),
          items,
          taxes,
          isExpense,
          isRecurring,
          recurrencePattern: isRecurring ? faker.helpers.arrayElement(['mensal', 'semanal', 'anual', 'trimestral']) : null,
          aiAnalysis: faker.lorem.paragraph(),
          aiTrends: {},
          createdAt: document.createdAt,
          updatedAt: document.updatedAt
        });
      }
      
      console.log(`Criados registros financeiros para o usuário ${user.name}`);
    }
    
    console.log('Seeder de registros financeiros executado com sucesso');
  } catch (error) {
    console.error('Erro ao executar seeder de registros financeiros:', error);
  }
};

module.exports = createFinancialRecords;
