import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  RadialLinearScale
} from 'chart.js';
import api from '../../services/api';
import { toast } from 'react-toastify';
import BudgetCategoryStats from '../../components/budget/BudgetCategoryStats';
import BudgetGroupList from '../../components/budget/BudgetGroupList';
import BudgetAnalyticsCharts from '../../components/budget/BudgetAnalyticsCharts';
import BudgetStatCards from '../../components/budget/BudgetStatCards';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

const BudgetPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState([]);
  const [budgetGroups, setBudgetGroups] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [uniqueCategories, setUniqueCategories] = useState([]);

  // Dados de exemplo para desenvolvimento
  const getMockBudgets = () => {
    return [
      {
        id: '1',
        title: 'Notebook Dell Inspiron 15',
        provider: 'Dell Computadores',
        providerCNPJ: '72.381.189/0001-10',
        issueDate: '2025-05-15',
        validUntil: '2025-06-15',
        totalAmount: 4599.90,
        currency: 'BRL',
        category: 'tecnologia',
        status: 'pendente',
        items: [
          {
            description: 'Notebook Dell Inspiron 15 3000',
            quantity: 1,
            unitPrice: 4599.90
          }
        ],
        paymentTerms: 'À vista ou em até 12x sem juros',
        deliveryTerms: 'Entrega em até 10 dias úteis',
        notes: 'Inclui garantia de 1 ano',
        contactInfo: {
          nome: 'Atendimento Dell',
          email: 'vendas@dell.com',
          telefone: '(11) 4004-0000'
        },
        groupId: 'notebook-dell-inspiron-group',
        deliveryTime: 10,
        warranty: '12 meses',
        warrantyMonths: 12,
        shippingCost: 0,
        reclameAquiScore: 7.8,
        productRating: 4.5,
        depreciation: 25,
        riskFactors: ['Modelo com mais de 6 meses no mercado']
      },
      {
        id: '2',
        title: 'Notebook Dell Inspiron 15',
        provider: 'Magazine Luiza',
        providerCNPJ: '47.960.950/0001-21',
        issueDate: '2025-05-20',
        validUntil: '2025-06-20',
        totalAmount: 4799.90,
        currency: 'BRL',
        category: 'tecnologia',
        status: 'pendente',
        items: [
          {
            description: 'Notebook Dell Inspiron 15 3000',
            quantity: 1,
            unitPrice: 4799.90
          }
        ],
        paymentTerms: 'À vista ou em até 10x sem juros',
        deliveryTerms: 'Entrega em até 15 dias úteis',
        notes: 'Frete grátis para todo o Brasil',
        contactInfo: {
          nome: 'SAC Magazine Luiza',
          email: 'sac@magazineluiza.com.br',
          telefone: '(11) 3504-2500'
        },
        groupId: 'notebook-dell-inspiron-group',
        deliveryTime: 15,
        warranty: '12 meses',
        warrantyMonths: 12,
        shippingCost: 0,
        reclameAquiScore: 6.5,
        productRating: 4.5,
        depreciation: 25,
        riskFactors: ['Preço acima da média', 'Tempo de entrega longo']
      },
      {
        id: '3',
        title: 'Notebook Dell Inspiron 15',
        provider: 'Amazon Brasil',
        providerCNPJ: '15.436.940/0001-03',
        issueDate: '2025-05-22',
        validUntil: '2025-06-22',
        totalAmount: 4499.90,
        currency: 'BRL',
        category: 'tecnologia',
        status: 'pendente',
        items: [
          {
            description: 'Notebook Dell Inspiron 15 3000',
            quantity: 1,
            unitPrice: 4499.90
          }
        ],
        paymentTerms: 'À vista ou em até 12x sem juros',
        deliveryTerms: 'Entrega em até 3 dias úteis',
        notes: 'Amazon Prime: entrega expressa',
        contactInfo: {
          nome: 'Atendimento Amazon',
          email: 'atendimento@amazon.com.br',
          telefone: '(11) 4004-1999'
        },
        groupId: 'notebook-dell-inspiron-group',
        deliveryTime: 3,
        warranty: '12 meses',
        warrantyMonths: 12,
        shippingCost: 0,
        reclameAquiScore: 8.2,
        productRating: 4.5,
        depreciation: 25,
        riskFactors: []
      },
      {
        id: '4',
        title: 'Geladeira Electrolux Frost Free',
        provider: 'Casas Bahia',
        providerCNPJ: '33.041.260/0652-90',
        issueDate: '2025-06-02',
        validUntil: '2025-07-02',
        totalAmount: 3299.90,
        currency: 'BRL',
        category: 'eletrodomestico',
        status: 'pendente',
        items: [
          {
            description: 'Geladeira Electrolux Frost Free 382L',
            quantity: 1,
            unitPrice: 3299.90
          }
        ],
        paymentTerms: 'À vista ou em até 12x sem juros',
        deliveryTerms: 'Entrega em até 10 dias úteis',
        notes: 'Instalação não inclusa',
        contactInfo: {
          nome: 'SAC Casas Bahia',
          email: 'sac@casasbahia.com.br',
          telefone: '(11) 3003-8889'
        },
        groupId: 'geladeira-electrolux-group',
        deliveryTime: 10,
        warranty: '12 meses',
        warrantyMonths: 12,
        shippingCost: 150,
        reclameAquiScore: 7.2,
        productRating: 4.5,
        depreciation: 18,
        riskFactors: []
      },
      {
        id: '5',
        title: 'Geladeira Electrolux Frost Free',
        provider: 'Fast Shop',
        providerCNPJ: '43.708.379/0001-00',
        issueDate: '2025-06-03',
        validUntil: '2025-07-03',
        totalAmount: 3399.90,
        currency: 'BRL',
        category: 'eletrodomestico',
        status: 'pendente',
        items: [
          {
            description: 'Geladeira Electrolux Frost Free 382L',
            quantity: 1,
            unitPrice: 3399.90
          }
        ],
        paymentTerms: 'À vista com 5% de desconto ou em até 10x sem juros',
        deliveryTerms: 'Entrega em até 7 dias úteis',
        notes: 'Instalação gratuita',
        contactInfo: {
          nome: 'SAC Fast Shop',
          email: 'sac@fastshop.com.br',
          telefone: '(11) 3003-3728'
        },
        groupId: 'geladeira-electrolux-group',
        deliveryTime: 7,
        warranty: '12 meses',
        warrantyMonths: 12,
        shippingCost: 0,
        reclameAquiScore: 8.5,
        productRating: 4.5,
        depreciation: 18,
        riskFactors: []
      },
      {
        id: '6',
        title: 'Notebook Sansung A20',
        provider: 'Loja A',
        providerCNPJ: '12.345.678/0001-90',
        issueDate: '2025-05-19',
        validUntil: '2025-06-19',
        totalAmount: 2000.00,
        currency: 'BRL',
        category: 'tecnologia',
        status: 'pendente',
        items: [
          {
            description: 'Notebook Sansung A20 Novo',
            quantity: 1,
            unitPrice: 2000.00
          }
        ],
        paymentTerms: 'À vista ou em até 10x sem juros',
        deliveryTerms: 'Entrega em até 5 dias úteis',
        notes: 'Garantia de 12 meses',
        contactInfo: {
          nome: 'Atendimento Loja A',
          email: 'atendimento@lojaa.com.br',
          telefone: '(11) 1234-5678'
        },
        groupId: 'notebook-comparacao-group',
        deliveryTime: 5,
        warranty: '12 meses',
        warrantyMonths: 12,
        shippingCost: 0,
        reclameAquiScore: 7.0,
        productRating: 3.8,
        depreciation: 30,
        riskFactors: ['Marca com histórico de problemas de assistência técnica']
      },
      {
        id: '7',
        title: 'Notebook Dell Inspiron 15',
        provider: 'Loja B',
        providerCNPJ: '23.456.789/0001-01',
        issueDate: '2025-05-20',
        validUntil: '2025-06-20',
        totalAmount: 1800.00,
        currency: 'BRL',
        category: 'tecnologia',
        status: 'pendente',
        items: [
          {
            description: 'Notebook Dell Inspiron 15 Novo',
            quantity: 1,
            unitPrice: 1800.00
          }
        ],
        paymentTerms: 'À vista ou em até 12x sem juros',
        deliveryTerms: 'Entrega em até 7 dias úteis',
        notes: 'Garantia de 12 meses',
        contactInfo: {
          nome: 'Atendimento Loja B',
          email: 'atendimento@lojab.com.br',
          telefone: '(11) 2345-6789'
        },
        groupId: 'notebook-comparacao-group',
        deliveryTime: 7,
        warranty: '12 meses',
        warrantyMonths: 12,
        shippingCost: 0,
        reclameAquiScore: 8.5,
        productRating: 4.7,
        depreciation: 25,
        riskFactors: []
      },
      {
        id: '8',
        title: 'Notebook Philco D20',
        provider: 'Loja C',
        providerCNPJ: '34.567.890/0001-12',
        issueDate: '2025-05-22',
        validUntil: '2025-06-22',
        totalAmount: 1500.00,
        currency: 'BRL',
        category: 'tecnologia',
        status: 'pendente',
        items: [
          {
            description: 'Notebook Philco D20 Novo',
            quantity: 1,
            unitPrice: 1500.00
          }
        ],
        paymentTerms: 'À vista ou em até 10x sem juros',
        deliveryTerms: 'Entrega em até 10 dias úteis',
        notes: 'Garantia de 12 meses',
        contactInfo: {
          nome: 'Atendimento Loja C',
          email: 'atendimento@lojac.com.br',
          telefone: '(11) 3456-7890'
        },
        groupId: 'notebook-comparacao-group',
        deliveryTime: 10,
        warranty: '12 meses',
        warrantyMonths: 12,
        shippingCost: 0,
        reclameAquiScore: 6.8,
        productRating: 3.5,
        depreciation: 35,
        riskFactors: ['Marca com alto índice de defeitos']
      },
      {
        id: '9',
        title: 'Sofá 3 Lugares',
        provider: 'MadeiraMadeira',
        providerCNPJ: '10.490.181/0001-87',
        issueDate: '2025-06-05',
        validUntil: '2025-07-05',
        totalAmount: 1299.90,
        currency: 'BRL',
        category: 'moveis',
        status: 'pendente',
        items: [
          {
            description: 'Sofá 3 Lugares Retrátil e Reclinável',
            quantity: 1,
            unitPrice: 1299.90
          }
        ],
        paymentTerms: 'À vista ou em até 10x sem juros',
        deliveryTerms: 'Entrega em até 15 dias úteis',
        notes: 'Montagem não inclusa',
        contactInfo: {
          nome: 'Atendimento MadeiraMadeira',
          email: 'atendimento@madeiramadeira.com.br',
          telefone: '(41) 4000-7000'
        },
        groupId: 'sofa-3-lugares-group',
        deliveryTime: 15,
        warranty: '3 meses',
        warrantyMonths: 3,
        shippingCost: 99.90,
        reclameAquiScore: 7.5,
        productRating: 4.2,
        depreciation: 20,
        riskFactors: []
      },
      {
        id: '10',
        title: 'Sofá 3 Lugares',
        provider: 'Mobly',
        providerCNPJ: '14.055.516/0001-91',
        issueDate: '2025-06-06',
        validUntil: '2025-07-06',
        totalAmount: 1499.90,
        currency: 'BRL',
        category: 'moveis',
        status: 'pendente',
        items: [
          {
            description: 'Sofá 3 Lugares Retrátil e Reclinável',
            quantity: 1,
            unitPrice: 1499.90
          }
        ],
        paymentTerms: 'À vista ou em até 12x sem juros',
        deliveryTerms: 'Entrega em até 10 dias úteis',
        notes: 'Montagem inclusa',
        contactInfo: {
          nome: 'Atendimento Mobly',
          email: 'atendimento@mobly.com.br',
          telefone: '(11) 4003-4848'
        },
        groupId: 'sofa-3-lugares-group',
        deliveryTime: 10,
        warranty: '6 meses',
        warrantyMonths: 6,
        shippingCost: 0,
        reclameAquiScore: 8.0,
        productRating: 4.5,
        depreciation: 20,
        riskFactors: []
      },
      {
        id: '11',
        title: 'Carro Hyundai HB20',
        provider: 'Concessionária A',
        providerCNPJ: '45.678.901/0001-23',
        issueDate: '2025-06-10',
        validUntil: '2025-07-10',
        totalAmount: 75000.00,
        currency: 'BRL',
        category: 'veiculos',
        status: 'pendente',
        items: [
          {
            description: 'Hyundai HB20 1.0 Sense 2025',
            quantity: 1,
            unitPrice: 75000.00
          }
        ],
        paymentTerms: 'Financiamento em até 60x',
        deliveryTerms: 'Entrega imediata',
        notes: 'Inclui documentação e emplacamento',
        contactInfo: {
          nome: 'Vendas Concessionária A',
          email: 'vendas@concessionariaa.com.br',
          telefone: '(11) 5555-1234'
        },
        groupId: 'carro-hb20-group',
        deliveryTime: 1,
        warranty: '36 meses',
        warrantyMonths: 36,
        shippingCost: 0,
        reclameAquiScore: 7.8,
        productRating: 4.3,
        depreciation: 15,
        riskFactors: []
      },
      {
        id: '12',
        title: 'Carro Hyundai HB20',
        provider: 'Concessionária B',
        providerCNPJ: '56.789.012/0001-34',
        issueDate: '2025-06-11',
        validUntil: '2025-07-11',
        totalAmount: 73500.00,
        currency: 'BRL',
        category: 'veiculos',
        status: 'pendente',
        items: [
          {
            description: 'Hyundai HB20 1.0 Sense 2025',
            quantity: 1,
            unitPrice: 73500.00
          }
        ],
        paymentTerms: 'Financiamento em até 60x',
        deliveryTerms: 'Entrega em 7 dias',
        notes: 'Inclui documentação e emplacamento',
        contactInfo: {
          nome: 'Vendas Concessionária B',
          email: 'vendas@concessionariab.com.br',
          telefone: '(11) 5555-5678'
        },
        groupId: 'carro-hb20-group',
        deliveryTime: 7,
        warranty: '36 meses',
        warrantyMonths: 36,
        shippingCost: 0,
        reclameAquiScore: 8.2,
        productRating: 4.3,
        depreciation: 15,
        riskFactors: []
      }
    ];
  };
  // Carregar orçamentos
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        setLoading(true);
        
        // Tentar obter grupos de orçamentos primeiro
        let groupsResponse;
        try {
          groupsResponse = await api.get('/budget/groups');
          if (groupsResponse.data && groupsResponse.data.success && groupsResponse.data.data.groups) {
            setBudgetGroups(groupsResponse.data.data.groups);
          }
        } catch (groupError) {
          console.error('Erro ao carregar grupos de orçamentos:', groupError);
          // Continuar mesmo se falhar ao carregar grupos
        }
        
        // Carregar todos os orçamentos
        const response = await api.get('/budget/records');
        
        let budgetsData = [];
        
        if (response.data && response.data.data) {
          // Verificar se os dados retornados têm a estrutura esperada
          if (response.data.data.records && Array.isArray(response.data.data.records)) {
            budgetsData = response.data.data.records;
          } else if (Array.isArray(response.data.data)) {
            budgetsData = response.data.data;
          } else {
            console.error('Formato de dados inesperado:', response.data);
            toast.error(t('budget.errors.loadFailed'));
            budgetsData = getMockBudgets(); // Usar dados de exemplo
          }
        } else {
          // Dados de fallback para desenvolvimento
          budgetsData = getMockBudgets();
        }
        
        setBudgets(budgetsData);
        
        // Agrupar orçamentos por título se não conseguimos do backend
        if (!groupsResponse || !groupsResponse.data || !groupsResponse.data.success) {
          const groups = {};
          
          // Agrupar por título
          budgetsData.forEach(budget => {
            const title = budget.title.trim();
            if (!groups[title]) {
              groups[title] = [];
            }
            groups[title].push(budget);
          });
          
          // Filtrar apenas grupos com pelo menos 2 orçamentos
          const validGroups = {};
          Object.keys(groups).forEach(title => {
            if (groups[title].length >= 2) {
              validGroups[title] = groups[title];
            }
          });
          
          setBudgetGroups(validGroups);
        }
        
        // Extrair categorias únicas
        const categories = [...new Set(budgetsData.map(b => b.category).filter(Boolean))];
        setUniqueCategories(categories);
        
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar orçamentos:', error);
        toast.error(t('budget.errors.loadFailed'));
        
        // Usar dados de exemplo em caso de erro
        const mockData = getMockBudgets();
        setBudgets(mockData);
        
        // Agrupar dados de exemplo
        const mockGroups = {};
        mockData.forEach(budget => {
          const title = budget.title.trim();
          if (!mockGroups[title]) {
            mockGroups[title] = [];
          }
          mockGroups[title].push(budget);
        });
        
        // Filtrar apenas grupos com pelo menos 2 orçamentos
        const validMockGroups = {};
        Object.keys(mockGroups).forEach(title => {
          if (mockGroups[title].length >= 2) {
            validMockGroups[title] = mockGroups[title];
          }
        });
        
        setBudgetGroups(validMockGroups);
        const mockCategories = [...new Set(mockData.map(b => b.category).filter(Boolean))];
        setUniqueCategories(mockCategories);
        
        setLoading(false);
      }
    };
    
    fetchBudgets();
  }, [t]);

  // Filtrar orçamentos
  const filteredBudgets = budgets.filter(budget => {
    if (filterStatus !== 'all' && budget.status !== filterStatus) return false;
    if (filterCategory !== 'all' && budget.category !== filterCategory) return false;
    return true;
  });

  // Alterar filtro de status
  const handleStatusFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  // Alterar filtro de categoria
  const handleCategoryFilterChange = (e) => {
    setFilterCategory(e.target.value);
  };

  // Atualizar dados após alterações
  const handleUpdate = () => {
    // Recarregar dados
    const fetchBudgets = async () => {
      try {
        // Tentar obter grupos de orçamentos
        const groupsResponse = await api.get('/budget/groups');
        if (groupsResponse.data && groupsResponse.data.success && groupsResponse.data.data.groups) {
          setBudgetGroups(groupsResponse.data.data.groups);
        }
        
        // Recarregar todos os orçamentos
        const response = await api.get('/budget/records');
        
        if (response.data && response.data.data) {
          if (response.data.data.records && Array.isArray(response.data.data.records)) {
            setBudgets(response.data.data.records);
          } else if (Array.isArray(response.data.data)) {
            setBudgets(response.data.data);
          }
        }
      } catch (error) {
        console.error('Erro ao atualizar dados:', error);
      }
    };
    
    fetchBudgets();
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate font-inter">
            {t('budget.title')}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-inter">
            {t('budget.insights.description')}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="filter-status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-inter">
              {t('budget.filterByStatus')}
            </label>
            <select
              id="filter-status"
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
              value={filterStatus}
              onChange={handleStatusFilterChange}
            >
              <option value="all">{t('common.all')}</option>
              <option value="pendente">{t('budget.status.pending')}</option>
              <option value="aprovado">{t('budget.status.approved')}</option>
              <option value="recusado">{t('budget.status.rejected')}</option>
              <option value="fechado">{t('budget.status.closed')}</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="filter-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-inter">
              {t('budget.filterByCategory')}
            </label>
            <select
              id="filter-category"
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
              value={filterCategory}
              onChange={handleCategoryFilterChange}
            >
              <option value="all">{t('common.all')}</option>
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>
                  {t(`budget.categories.${category}`, { defaultValue: category })}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cards estatísticos */}
      <BudgetStatCards budgets={filteredBudgets} />

      {/* Cards estatísticos por categoria */}
      <BudgetCategoryStats budgets={filteredBudgets} />

      {/* Lista de grupos de orçamentos */}
      <BudgetGroupList 
        budgetGroups={budgetGroups} 
        onUpdate={handleUpdate} 
      />

      {/* Gráficos analíticos */}
      <BudgetAnalyticsCharts 
        budgets={filteredBudgets} 
        budgetGroups={budgetGroups} 
      />
    </div>
  );
};

export default BudgetPage;
