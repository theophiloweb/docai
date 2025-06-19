/**
 * Seeder para registros médicos
 * 
 * Este script popula a tabela de registros médicos com dados de exemplo.
 * 
 * @author Doc.AI Team
 */

const { v4: uuidv4 } = require('uuid');
const { User, Document, MedicalRecord } = require('../../models');
const { faker } = require('@faker-js/faker/locale/pt_BR');

const createMedicalRecords = async () => {
  try {
    // Buscar usuários com papel 'user'
    const users = await User.findAll({ where: { role: 'user' } });
    
    if (users.length === 0) {
      console.log('Nenhum usuário encontrado para criar registros médicos');
      return;
    }

    // Para cada usuário, criar documentos médicos e registros médicos
    for (const user of users) {
      // Criar documentos médicos
      const documentTypes = ['consulta', 'exame', 'laudo', 'atestado', 'receituario', 'encaminhamento', 'prescricao'];
      const documents = [];

      for (let i = 0; i < 15; i++) {
        const documentType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
        const document = await Document.create({
          id: uuidv4(),
          userId: user.id,
          title: `${documentType.charAt(0).toUpperCase() + documentType.slice(1)} - ${faker.date.past().toLocaleDateString('pt-BR')}`,
          description: faker.lorem.sentence(),
          category: 'medical',
          tags: [documentType, faker.helpers.arrayElement(['cardiologia', 'dermatologia', 'ortopedia', 'clinica_geral', 'neurologia'])],
          filePath: `/uploads/${uuidv4()}.pdf`,
          fileType: 'application/pdf',
          fileSize: faker.number.int({ min: 100000, max: 5000000 }),
          contentText: faker.lorem.paragraphs(3),
          aiProcessed: true,
          aiSummary: faker.lorem.paragraph(),
          aiEntities: {
            doctor: faker.person.fullName(),
            crm: `CRM/${faker.location.state()} ${faker.number.int({ min: 10000, max: 99999 })}`,
            date: faker.date.past().toISOString(),
            specialty: faker.helpers.arrayElement(['Cardiologia', 'Dermatologia', 'Ortopedia', 'Clínica Geral', 'Neurologia'])
          },
          aiCategories: ['medical', documentType],
          createdAt: faker.date.past(),
          updatedAt: faker.date.recent()
        });
        
        documents.push(document);
      }

      // Criar registros médicos baseados nos documentos
      for (const document of documents) {
        const recordType = document.tags[0];
        const recordDate = new Date(document.aiEntities.date);
        const specialty = document.aiEntities.specialty;
        
        // Dados específicos para cada tipo de registro
        let vitalSigns = {};
        let labResults = {};
        let medications = [];
        
        // Consulta ou exame
        if (recordType === 'consulta' || recordType === 'exame') {
          vitalSigns = {
            pressao: faker.helpers.arrayElement(['120/80', '130/85', '110/70', '140/90', '125/82']),
            temperatura: faker.number.float({ min: 35.5, max: 37.5, precision: 0.1 }),
            frequenciaCardiaca: faker.number.int({ min: 60, max: 100 }),
            frequenciaRespiratoria: faker.number.int({ min: 12, max: 20 }),
            saturacao: faker.number.int({ min: 95, max: 100 })
          };
        }
        
        // Exame
        if (recordType === 'exame') {
          labResults = {
            hemoglobina: faker.number.float({ min: 12, max: 18, precision: 0.1 }),
            glicose: faker.number.int({ min: 70, max: 110 }),
            colesterolTotal: faker.number.int({ min: 150, max: 240 }),
            colesterolHDL: faker.number.int({ min: 40, max: 60 }),
            colesterolLDL: faker.number.int({ min: 70, max: 160 }),
            triglicerideos: faker.number.int({ min: 50, max: 200 }),
            creatinina: faker.number.float({ min: 0.6, max: 1.2, precision: 0.1 }),
            ureia: faker.number.int({ min: 10, max: 50 })
          };
        }
        
        // Receituário ou prescrição
        if (recordType === 'receituario' || recordType === 'prescricao') {
          const numMeds = faker.number.int({ min: 1, max: 3 });
          for (let i = 0; i < numMeds; i++) {
            medications.push({
              nome: faker.helpers.arrayElement([
                'Dipirona 500mg', 'Paracetamol 750mg', 'Ibuprofeno 600mg', 
                'Amoxicilina 500mg', 'Losartana 50mg', 'Atenolol 25mg',
                'Omeprazol 20mg', 'Sinvastatina 20mg', 'Metformina 850mg'
              ]),
              posologia: faker.helpers.arrayElement([
                '1 comprimido a cada 8 horas', 
                '1 comprimido a cada 12 horas',
                '1 comprimido ao dia',
                '2 comprimidos de 12 em 12 horas',
                '1 comprimido em jejum'
              ]),
              duracao: faker.helpers.arrayElement([
                '7 dias', '10 dias', '14 dias', 'Uso contínuo', '30 dias'
              ])
            });
          }
        }
        
        // Criar o registro médico
        await MedicalRecord.create({
          id: uuidv4(),
          documentId: document.id,
          userId: user.id,
          recordType,
          recordDate,
          doctorName: document.aiEntities.doctor,
          doctorCRM: document.aiEntities.crm,
          specialty,
          institution: faker.company.name() + ' ' + faker.helpers.arrayElement(['Hospital', 'Clínica', 'Centro Médico']),
          diagnosis: recordType === 'laudo' || recordType === 'consulta' ? faker.lorem.sentences(2) : null,
          symptoms: recordType === 'consulta' ? faker.lorem.sentences(1) : null,
          treatment: recordType === 'consulta' || recordType === 'prescricao' ? faker.lorem.sentences(2) : null,
          medications,
          vitalSigns,
          labResults,
          recommendations: faker.helpers.maybe(() => faker.lorem.sentences(2)),
          aiAnalysis: faker.lorem.paragraph(),
          aiTrends: {},
          createdAt: document.createdAt,
          updatedAt: document.updatedAt
        });
      }
      
      console.log(`Criados registros médicos para o usuário ${user.name}`);
    }
    
    console.log('Seeder de registros médicos executado com sucesso');
  } catch (error) {
    console.error('Erro ao executar seeder de registros médicos:', error);
  }
};

module.exports = createMedicalRecords;
