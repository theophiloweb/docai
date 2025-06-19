/**
 * Seeder para registros de orçamentos
 * 
 * Este script popula a tabela de registros de orçamentos com dados de exemplo.
 * 
 * @author Doc.AI Team
 */

const { v4: uuidv4 } = require('uuid');
const { User, Document, BudgetRecord } = require('../../models');
const { faker } = require('@faker-js/faker/locale/pt_BR');

const createBudgetRecords = async () => {
  try {
    // Buscar usuários com papel 'user'
    const users = await User.findAll({ where: { role: 'user' } });
    
    if (users.length === 0) {
      console.log('Nenhum usuário encontrado para criar registros de orçamentos');
      return;
    }

    // Categorias de orçamentos
    const budgetCategories = [
      'reforma', 'construção', 'serviços', 'eventos', 'equipamentos', 
      'móveis', 'viagem', 'tecnologia', 'veículos', 'outros'
    ];
    
    // Fornecedores por categoria
    const providersByCategory = {
      reforma: ['Construtora Silva', 'Reformas Express', 'Empreiteira Confiança', 'Arquitetos Associados', 'Casa Nova Reformas'],
      construção: ['Construtora Almeida', 'Engenharia Total', 'Construções Modernas', 'Edificar Construtora', 'Obra Prima'],
      serviços: ['Serviços Gerais Ltda', 'Manutenção 24h', 'Técnicos Especializados', 'Assistência Domiciliar', 'Profissionais Unidos'],
      eventos: ['Buffet Elegance', 'Festas & Cia', 'Cerimonial Perfeito', 'Eventos Premium', 'Celebrações Especiais'],
      equipamentos: ['Máquinas Brasil', 'Equipamentos Industriais', 'Ferramentas & Cia', 'Tecnologia Industrial', 'Suprimentos Técnicos'],
      móveis: ['Móveis Planejados', 'Decoração Total', 'Ambientes Perfeitos', 'Design Interiores', 'Casa & Estilo'],
      viagem: ['Agência Turismo Total', 'Viagens Incríveis', 'Pacotes Especiais', 'Destinos Exclusivos', 'Férias Perfeitas'],
      tecnologia: ['TechMaster', 'Soluções Digitais', 'Informática Avançada', 'Sistemas Integrados', 'Tecnologia Express'],
      veículos: ['Concessionária Silva', 'Auto Center', 'Veículos Premium', 'Carros & Cia', 'Oficina Especializada'],
      outros: ['Serviços Diversos', 'Soluções Completas', 'Multiservices', 'Atendimento Especializado', 'Profissionais Unidos']
    };

    // Status possíveis
    const statusOptions = ['pendente', 'aprovado', 'rejeitado', 'expirado', 'convertido'];

    // Para cada usuário, criar documentos de orçamento e registros de orçamento
    for (const user of users) {
      // Criar documentos de orçamento
      const documents = [];

      for (let i = 0; i < 12; i++) {
        const category = budgetCategories[Math.floor(Math.random() * budgetCategories.length)];
        const provider = providersByCategory[category][Math.floor(Math.random() * providersByCategory[category].length)];
        
        const issueDate = faker.date.between({ 
          from: new Date(new Date().setFullYear(new Date().getFullYear() - 1)), 
          to: new Date() 
        });
        
        // Data de validade (entre 15 e 90 dias após a emissão)
        const validUntil = new Date(issueDate);
        validUntil.setDate(validUntil.getDate() + faker.number.int({ min: 15, max: 90 }));
        
        const totalAmount = faker.number.float({ min: 500, max: 50000, precision: 0.01 });
        
        const document = await Document.create({
          id: uuidv4(),
          userId: user.id,
          title: `Orçamento - ${provider}`,
          description: `${category.charAt(0).toUpperCase() + category.slice(1)} - R$ ${totalAmount.toFixed(2)}`,
          category: 'budget',
          tags: ['orcamento', category],
          filePath: `/uploads/${uuidv4()}.pdf`,
          fileType: 'application/pdf',
          fileSize: faker.number.int({ min: 100000, max: 3000000 }),
          contentText: faker.lorem.paragraphs(3),
          aiProcessed: true,
          aiSummary: `Orçamento de ${provider} para ${category} no valor de R$ ${totalAmount.toFixed(2)}. Válido até ${validUntil.toLocaleDateString('pt-BR')}.`,
          aiEntities: {
            provider,
            totalAmount,
            issueDate: issueDate.toISOString(),
            validUntil: validUntil.toISOString(),
            category,
            status: faker.helpers.arrayElement(statusOptions)
          },
          aiCategories: ['budget', category],
          createdAt: issueDate,
          updatedAt: faker.date.recent()
        });
        
        documents.push(document);
      }

      // Criar registros de orçamento baseados nos documentos
      for (const document of documents) {
        const category = document.tags[1];
        const provider = document.aiEntities.provider;
        const issueDate = new Date(document.aiEntities.issueDate);
        const validUntil = new Date(document.aiEntities.validUntil);
        const totalAmount = document.aiEntities.totalAmount;
        const status = document.aiEntities.status;
        
        // Dados específicos para cada orçamento
        let items = [];
        const numItems = faker.number.int({ min: 1, max: 5 });
        let totalItems = 0;
        
        for (let i = 0; i < numItems; i++) {
          const itemAmount = faker.number.float({ min: 100, max: totalAmount / 2, precision: 0.01 });
          const quantity = faker.number.int({ min: 1, max: 10 });
          const itemTotal = itemAmount * quantity;
          totalItems += itemTotal;
          
          items.push({
            descricao: faker.commerce.productName(),
            quantidade: quantity,
            valorUnitario: itemAmount,
            valorTotal: itemTotal
          });
        }
        
        // Ajustar o último item para que a soma bata com o total
        if (items.length > 0) {
          const diff = totalAmount - totalItems;
          items[items.length - 1].valorTotal += diff;
          items[items.length - 1].valorUnitario = items[items.length - 1].valorTotal / items[items.length - 1].quantidade;
        }
        
        // Orçamentos concorrentes
        const competingQuotes = [];
        const hasCompeting = faker.datatype.boolean(0.7); // 70% de chance de ter orçamentos concorrentes
        
        if (hasCompeting) {
          const numCompeting = faker.number.int({ min: 1, max: 3 });
          for (let i = 0; i < numCompeting; i++) {
            const variation = faker.number.float({ min: -0.2, max: 0.3 }); // -20% a +30%
            const competingAmount = totalAmount * (1 + variation);
            
            competingQuotes.push({
              provider: faker.company.name(),
              amount: competingAmount
            });
          }
        }
        
        // Criar o registro de orçamento
        await BudgetRecord.create({
          id: uuidv4(),
          documentId: document.id,
          userId: user.id,
          title: document.title,
          provider,
          providerCNPJ: faker.number.int({ min: 10000000000000, max: 99999999999999 }).toString(),
          issueDate,
          validUntil,
          totalAmount,
          currency: 'BRL',
          category,
          status,
          items,
          paymentTerms: faker.helpers.arrayElement([
            'Pagamento à vista', 
            'Pagamento em 30 dias', 
            '50% de entrada e 50% na entrega',
            'Parcelado em 3x sem juros',
            'Parcelado em até 10x com juros'
          ]),
          deliveryTerms: faker.helpers.arrayElement([
            'Entrega imediata',
            'Entrega em 15 dias úteis',
            'Entrega em 30 dias úteis',
            'Entrega a combinar',
            'Retirada no local'
          ]),
          notes: faker.helpers.maybe(() => faker.lorem.paragraph()),
          contactInfo: {
            nome: faker.person.fullName(),
            email: faker.internet.email(),
            telefone: faker.phone.number()
          },
          competingQuotes,
          aiAnalysis: faker.lorem.paragraph(),
          aiRecommendation: faker.helpers.maybe(() => faker.lorem.paragraph()),
          aiComparison: hasCompeting ? {
            recommendation: faker.helpers.arrayElement([
              'Este orçamento apresenta a melhor relação custo-benefício',
              'Há opções mais econômicas disponíveis',
              'Este é o orçamento mais caro, mas oferece mais recursos',
              'Recomendamos negociar o valor deste orçamento'
            ]),
            percentageDifference: faker.helpers.arrayElement([
              '10% mais caro que a média',
              '5% mais barato que a média',
              'Na média do mercado',
              '15% acima do orçamento mais barato'
            ])
          } : {},
          createdAt: document.createdAt,
          updatedAt: document.updatedAt
        });
      }
      
      console.log(`Criados registros de orçamentos para o usuário ${user.name}`);
    }
    
    console.log('Seeder de registros de orçamentos executado com sucesso');
  } catch (error) {
    console.error('Erro ao executar seeder de registros de orçamentos:', error);
  }
};

module.exports = createBudgetRecords;
