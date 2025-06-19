# Dashboards Especializados - Doc.AI

Este documento detalha os dashboards especializados implementados no sistema Doc.AI para visualização e análise de diferentes tipos de documentos.

## Visão Geral

O Doc.AI oferece quatro dashboards especializados:

1. **Dashboard Geral**: Visão geral de todos os documentos e insights
2. **Dashboard Médico**: Visualização de histórico médico, consultas e exames
3. **Dashboard Financeiro**: Análise de despesas, receitas e fluxo de caixa
4. **Dashboard de Orçamentos**: Comparação e acompanhamento de orçamentos

Cada dashboard é projetado para fornecer insights específicos e relevantes para o tipo de documento correspondente.

## Dashboard Geral

O Dashboard Geral oferece uma visão consolidada de todos os documentos e insights do usuário.

### Componentes Principais

- **Resumo de Documentos**: Cards mostrando o total de documentos por categoria
- **Documentos Recentes**: Lista dos últimos documentos enviados
- **Insights Gerais**: Insights gerados pela IA combinando dados de diferentes categorias
- **Atividade Recente**: Histórico de ações do usuário
- **Documentos Pendentes**: Documentos que requerem atenção (ex: orçamentos prestes a expirar)

### Implementação

O Dashboard Geral é implementado no arquivo `frontend/src/pages/dashboard/DashboardPage.js`:

```javascript
// Componente do Dashboard Geral
const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [insights, setInsights] = useState([]);
  
  // Carregar dados do dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/documents/dashboard');
        setDashboardData(response.data.data);
        
        // Gerar insights com base nos dados
        const generatedInsights = await aiService.generateGeneralInsights(response.data.data);
        setInsights(generatedInsights);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Renderizar componentes do dashboard
  return (
    <div className="dashboard-container">
      {/* Resumo de Documentos */}
      <DocumentSummary data={dashboardData?.summary} loading={loading} />
      
      {/* Insights Gerais */}
      <InsightsSection insights={insights} loading={loading} />
      
      {/* Documentos Recentes */}
      <RecentDocuments documents={dashboardData?.recentDocuments} loading={loading} />
      
      {/* Atividade Recente */}
      <RecentActivity activities={dashboardData?.recentActivities} loading={loading} />
      
      {/* Documentos Pendentes */}
      <PendingDocuments documents={dashboardData?.pendingDocuments} loading={loading} />
    </div>
  );
};
```

## Dashboard Médico

O Dashboard Médico oferece uma visão completa do histórico de saúde do usuário.

### Componentes Principais

- **Resumo Médico**: Cards mostrando o total de documentos médicos, consultas, exames, laudos e receitas
- **Última Consulta**: Detalhes da última consulta médica
- **Evolução de Sinais Vitais**: Gráficos de evolução de pressão arterial, frequência cardíaca, etc.
- **Evolução de Exames**: Gráficos de evolução de exames laboratoriais (glicose, colesterol, etc.)
- **Insights Médicos**: Análise de tendências e recomendações geradas pela IA
- **Consultas Recentes**: Lista de consultas recentes com detalhes e acesso rápido
- **Próximas Consultas**: Consultas agendadas e recomendadas

### Implementação

O Dashboard Médico é implementado no arquivo `frontend/src/pages/dashboard/MedicalHistoryPage.js`:

```javascript
// Componente do Dashboard Médico
const MedicalHistoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [medicalData, setMedicalData] = useState(null);
  const [insights, setInsights] = useState([]);
  
  // Carregar dados médicos
  useEffect(() => {
    const fetchMedicalData = async () => {
      try {
        const response = await api.get('/medical/dashboard');
        setMedicalData(response.data.data);
        
        // Gerar insights médicos
        const generatedInsights = await aiService.generateMedicalInsights(response.data.data);
        setInsights(generatedInsights);
      } catch (error) {
        console.error('Erro ao carregar dados médicos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMedicalData();
  }, []);
  
  // Renderizar componentes do dashboard médico
  return (
    <div className="medical-dashboard-container">
      {/* Resumo Médico */}
      <MedicalSummary data={medicalData?.summary} loading={loading} />
      
      {/* Última Consulta */}
      <LastAppointment data={medicalData?.lastAppointment} loading={loading} />
      
      {/* Insights Médicos */}
      <MedicalInsights insights={insights} loading={loading} />
      
      {/* Gráficos de Evolução */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <VitalSignsChart data={medicalData?.vitalSigns} loading={loading} />
        <LabResultsChart data={medicalData?.labResults} loading={loading} />
      </div>
      
      {/* Consultas Recentes */}
      <RecentAppointments appointments={medicalData?.recentAppointments} loading={loading} />
      
      {/* Próximas Consultas */}
      <UpcomingAppointments appointments={medicalData?.upcomingAppointments} loading={loading} />
    </div>
  );
};
```

### Gráficos de Evolução

Os gráficos de evolução são implementados com Chart.js:

```javascript
// Componente de Gráfico de Sinais Vitais
const VitalSignsChart = ({ data, loading }) => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);
  
  useEffect(() => {
    if (loading || !data) return;
    
    // Destruir gráfico anterior se existir
    if (chart) {
      chart.destroy();
    }
    
    // Criar novo gráfico
    const ctx = chartRef.current.getContext('2d');
    const newChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.dates,
        datasets: [
          {
            label: 'Pressão Sistólica',
            data: data.systolic,
            borderColor: '#4C51BF',
            backgroundColor: 'rgba(76, 81, 191, 0.1)',
            tension: 0.4
          },
          {
            label: 'Pressão Diastólica',
            data: data.diastolic,
            borderColor: '#ED64A6',
            backgroundColor: 'rgba(237, 100, 166, 0.1)',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Evolução da Pressão Arterial'
          }
        }
      }
    });
    
    setChart(newChart);
  }, [data, loading]);
  
  if (loading) {
    return <div className="loading-skeleton h-80"></div>;
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Evolução da Pressão Arterial</h3>
      <canvas ref={chartRef} height="300"></canvas>
    </div>
  );
};
```

## Dashboard Financeiro

O Dashboard Financeiro permite ao usuário acompanhar suas finanças.

### Componentes Principais

- **Resumo Financeiro**: Cards mostrando o total de documentos financeiros, faturas, recibos, extratos, despesas e receitas
- **Despesas Mensais**: Gráfico de despesas mensais com análise de tendências
- **Receitas vs Despesas**: Gráfico de receitas vs despesas para visualização do fluxo de caixa
- **Despesas por Categoria**: Gráfico de despesas por categoria para identificar os principais gastos
- **Insights Financeiros**: Análise de padrões de gastos e recomendações geradas pela IA
- **Transações Recentes**: Lista de transações recentes com detalhes e categorização
- **Faturas Pendentes**: Faturas a vencer com alertas de prazo

### Implementação

O Dashboard Financeiro é implementado no arquivo `frontend/src/pages/dashboard/FinancialPage.js`:

```javascript
// Componente do Dashboard Financeiro
const FinancialPage = () => {
  const [loading, setLoading] = useState(true);
  const [financialData, setFinancialData] = useState(null);
  const [insights, setInsights] = useState([]);
  
  // Carregar dados financeiros
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const response = await api.get('/financial/dashboard');
        setFinancialData(response.data.data);
        
        // Gerar insights financeiros
        const generatedInsights = await aiService.generateFinancialInsights(response.data.data);
        setInsights(generatedInsights);
      } catch (error) {
        console.error('Erro ao carregar dados financeiros:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFinancialData();
  }, []);
  
  // Renderizar componentes do dashboard financeiro
  return (
    <div className="financial-dashboard-container">
      {/* Resumo Financeiro */}
      <FinancialSummary data={financialData?.summary} loading={loading} />
      
      {/* Insights Financeiros */}
      <FinancialInsights insights={insights} loading={loading} />
      
      {/* Gráficos Financeiros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <MonthlyExpensesChart data={financialData?.monthlyExpenses} loading={loading} />
        <IncomeVsExpensesChart data={financialData?.incomeVsExpenses} loading={loading} />
      </div>
      
      {/* Despesas por Categoria */}
      <ExpensesByCategoryChart data={financialData?.expensesByCategory} loading={loading} />
      
      {/* Transações Recentes */}
      <RecentTransactions transactions={financialData?.recentTransactions} loading={loading} />
      
      {/* Faturas Pendentes */}
      <PendingInvoices invoices={financialData?.pendingInvoices} loading={loading} />
    </div>
  );
};
```

### Gráficos Financeiros

Os gráficos financeiros são implementados com Chart.js:

```javascript
// Componente de Gráfico de Despesas por Categoria
const ExpensesByCategoryChart = ({ data, loading }) => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);
  
  useEffect(() => {
    if (loading || !data) return;
    
    // Destruir gráfico anterior se existir
    if (chart) {
      chart.destroy();
    }
    
    // Criar novo gráfico
    const ctx = chartRef.current.getContext('2d');
    const newChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.categories,
        datasets: [
          {
            data: data.values,
            backgroundColor: [
              '#4C51BF',
              '#ED64A6',
              '#ECC94B',
              '#48BB78',
              '#4299E1',
              '#9F7AEA',
              '#ED8936',
              '#E53E3E'
            ]
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: 'Despesas por Categoria'
          }
        }
      }
    });
    
    setChart(newChart);
  }, [data, loading]);
  
  if (loading) {
    return <div className="loading-skeleton h-80"></div>;
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Despesas por Categoria</h3>
      <canvas ref={chartRef} height="300"></canvas>
    </div>
  );
};
```

## Dashboard de Orçamentos

O Dashboard de Orçamentos ajuda o usuário a tomar decisões de compra.

### Componentes Principais

- **Resumo de Orçamentos**: Cards mostrando o total de orçamentos, status (pendentes, aprovados, rejeitados, expirados) e valor total
- **Orçamentos por Categoria**: Gráfico de orçamentos por categoria para visualizar a distribuição de valores
- **Grupos de Orçamentos**: Lista expansível de grupos de orçamentos (pelo menos 2 orçamentos do mesmo produto)
- **Análise de IA**: Comparação e recomendação da melhor opção para cada grupo
- **Orçamentos por Status**: Gráfico de orçamentos por status para acompanhar o progresso
- **Orçamentos Recentes**: Lista de orçamentos recentes com detalhes e status

### Implementação

O Dashboard de Orçamentos é implementado no arquivo `frontend/src/pages/dashboard/BudgetPage.js`:

```javascript
// Componente do Dashboard de Orçamentos
const BudgetPage = () => {
  const [loading, setLoading] = useState(true);
  const [budgetData, setBudgetData] = useState(null);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Carregar dados de orçamentos
  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const response = await api.get('/budget/dashboard');
        setBudgetData(response.data.data);
        setFilteredRecords(response.data.data.records || []);
      } catch (error) {
        console.error('Erro ao carregar dados de orçamentos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBudgetData();
  }, []);
  
  // Aplicar filtros
  useEffect(() => {
    if (!budgetData?.records) return;
    
    let filtered = [...budgetData.records];
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(record => record.category === categoryFilter);
    }
    
    setFilteredRecords(filtered);
  }, [statusFilter, categoryFilter, budgetData]);
  
  // Renderizar componentes do dashboard de orçamentos
  return (
    <div className="budget-dashboard-container">
      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <StatusSelector value={statusFilter} onChange={setStatusFilter} />
        <CategorySelector value={categoryFilter} onChange={setCategoryFilter} />
      </div>
      
      {/* Resumo de Orçamentos */}
      <BudgetSummary data={budgetData?.summary} loading={loading} />
      
      {/* Estatísticas por Categoria */}
      <BudgetCategoryStats data={budgetData?.categoryStats} loading={loading} />
      
      {/* Gráficos Analíticos */}
      <BudgetAnalyticsCharts data={budgetData} loading={loading} />
      
      {/* Grupos de Orçamentos */}
      <BudgetGroupList 
        groups={budgetData?.groups} 
        records={filteredRecords} 
        loading={loading} 
        onStatusChange={handleStatusChange} 
      />
    </div>
  );
};
```

### Componentes Específicos de Orçamentos

O Dashboard de Orçamentos utiliza componentes específicos para análise e comparação:

```javascript
// Componente de Lista de Grupos de Orçamentos
const BudgetGroupList = ({ groups, records, loading, onStatusChange }) => {
  const [expandedGroups, setExpandedGroups] = useState({});
  
  // Expandir/colapsar grupo
  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };
  
  if (loading) {
    return <div className="loading-skeleton h-80"></div>;
  }
  
  if (!groups || groups.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <p className="text-gray-500 text-center">Nenhum grupo de orçamentos encontrado.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">Grupos de Orçamentos</h3>
      
      {groups.map(group => (
        <div key={group.id} className="border rounded-lg mb-4">
          <div 
            className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => toggleGroup(group.id)}
          >
            <div>
              <h4 className="text-lg font-medium">{group.title}</h4>
              <p className="text-sm text-gray-500">{group.budgets.length} orçamentos</p>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">
                {formatCurrency(group.minPrice)} - {formatCurrency(group.maxPrice)}
              </span>
              <ChevronDownIcon 
                className={`w-5 h-5 transition-transform ${expandedGroups[group.id] ? 'transform rotate-180' : ''}`} 
              />
            </div>
          </div>
          
          {expandedGroups[group.id] && (
            <div className="p-4 border-t">
              {/* Análise de IA */}
              <BudgetAIAnalysis groupId={group.id} budgets={group.budgets} />
              
              {/* Tabela de Comparação */}
              <ComparisonTable budgets={group.budgets} onStatusChange={onStatusChange} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Componente de Análise de IA
const BudgetAIAnalysis = ({ groupId, budgets }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const response = await aiService.generateBudgetInsights({ groupId, budgets });
        setAnalysis(response);
      } catch (error) {
        console.error('Erro ao gerar análise de orçamentos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalysis();
  }, [groupId, budgets]);
  
  if (loading) {
    return <div className="loading-skeleton h-40 mb-4"></div>;
  }
  
  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-4">
      <h5 className="text-lg font-semibold mb-2">Análise de IA</h5>
      
      <div className="mb-3">
        <h6 className="font-medium">Recomendação:</h6>
        <p>{analysis?.recommendations[0]}</p>
      </div>
      
      <div className="mb-3">
        <h6 className="font-medium">Justificativa:</h6>
        <p>{analysis?.recommendations[1]}</p>
      </div>
      
      <div>
        <h6 className="font-medium">Fatores de Risco:</h6>
        <ul className="list-disc list-inside">
          {analysis?.risks.map((risk, index) => (
            <li key={index}>{risk}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
```

## Integração entre Dashboards

Os dashboards são integrados através de links e referências cruzadas:

- O Dashboard Geral exibe cards que levam aos dashboards especializados
- Os insights do Dashboard Geral podem incluir referências a documentos específicos
- Os dashboards especializados incluem links de volta ao Dashboard Geral
- Os documentos podem ser acessados a partir de qualquer dashboard

## Dados para os Dashboards

### Endpoint de API para o Dashboard Geral

```javascript
// Controlador para o Dashboard Geral
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Obter resumo de documentos
    const summary = await getDocumentSummary(userId);
    
    // Obter documentos recentes
    const recentDocuments = await getRecentDocuments(userId);
    
    // Obter atividade recente
    const recentActivities = await getRecentActivities(userId);
    
    // Obter documentos pendentes
    const pendingDocuments = await getPendingDocuments(userId);
    
    return res.status(200).json({
      success: true,
      data: {
        summary,
        recentDocuments,
        recentActivities,
        pendingDocuments
      }
    });
  } catch (error) {
    logger.error('Erro ao obter dados do dashboard:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao obter dados do dashboard',
      error: error.message
    });
  }
};
```

### Endpoint de API para o Dashboard Médico

```javascript
// Controlador para o Dashboard Médico
exports.getMedicalDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Obter resumo médico
    const summary = await getMedicalSummary(userId);
    
    // Obter última consulta
    const lastAppointment = await getLastAppointment(userId);
    
    // Obter sinais vitais
    const vitalSigns = await getVitalSigns(userId);
    
    // Obter resultados de exames
    const labResults = await getLabResults(userId);
    
    // Obter consultas recentes
    const recentAppointments = await getRecentAppointments(userId);
    
    // Obter próximas consultas
    const upcomingAppointments = await getUpcomingAppointments(userId);
    
    return res.status(200).json({
      success: true,
      data: {
        summary,
        lastAppointment,
        vitalSigns,
        labResults,
        recentAppointments,
        upcomingAppointments
      }
    });
  } catch (error) {
    logger.error('Erro ao obter dados do dashboard médico:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao obter dados do dashboard médico',
      error: error.message
    });
  }
};
```

### Endpoint de API para o Dashboard Financeiro

```javascript
// Controlador para o Dashboard Financeiro
exports.getFinancialDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Obter resumo financeiro
    const summary = await getFinancialSummary(userId);
    
    // Obter despesas mensais
    const monthlyExpenses = await getMonthlyExpenses(userId);
    
    // Obter receitas vs despesas
    const incomeVsExpenses = await getIncomeVsExpenses(userId);
    
    // Obter despesas por categoria
    const expensesByCategory = await getExpensesByCategory(userId);
    
    // Obter transações recentes
    const recentTransactions = await getRecentTransactions(userId);
    
    // Obter faturas pendentes
    const pendingInvoices = await getPendingInvoices(userId);
    
    return res.status(200).json({
      success: true,
      data: {
        summary,
        monthlyExpenses,
        incomeVsExpenses,
        expensesByCategory,
        recentTransactions,
        pendingInvoices
      }
    });
  } catch (error) {
    logger.error('Erro ao obter dados do dashboard financeiro:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao obter dados do dashboard financeiro',
      error: error.message
    });
  }
};
```

### Endpoint de API para o Dashboard de Orçamentos

```javascript
// Controlador para o Dashboard de Orçamentos
exports.getBudgetDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Obter resumo de orçamentos
    const summary = await getBudgetSummary(userId);
    
    // Obter estatísticas por categoria
    const categoryStats = await getBudgetCategoryStats(userId);
    
    // Obter grupos de orçamentos
    const groups = await getBudgetGroups(userId);
    
    // Obter registros de orçamentos
    const records = await getBudgetRecords(userId);
    
    return res.status(200).json({
      success: true,
      data: {
        summary,
        categoryStats,
        groups,
        records
      }
    });
  } catch (error) {
    logger.error('Erro ao obter dados do dashboard de orçamentos:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao obter dados do dashboard de orçamentos',
      error: error.message
    });
  }
};
```

## Considerações de Desempenho

Para garantir o desempenho dos dashboards, as seguintes otimizações foram implementadas:

1. **Carregamento Assíncrono**: Os dados são carregados de forma assíncrona
2. **Paginação**: Listas longas são paginadas para reduzir o volume de dados
3. **Caching**: Dados que não mudam frequentemente são armazenados em cache
4. **Lazy Loading**: Componentes são carregados apenas quando necessários
5. **Skeleton Loading**: Indicadores de carregamento são exibidos enquanto os dados são carregados

## Próximos Passos

### Melhorias Planejadas

1. **Dashboard Médico**:
   - Adicionar linha do tempo de histórico médico
   - Implementar alertas para exames periódicos
   - Adicionar comparação com valores de referência para exames

2. **Dashboard Financeiro**:
   - Adicionar previsão de gastos futuros
   - Implementar metas financeiras
   - Adicionar análise de tendências de longo prazo

3. **Dashboard de Orçamentos**:
   - Adicionar histórico de preços
   - Implementar alertas de queda de preço
   - Adicionar comparação com preços online

4. **Dashboard Geral**:
   - Adicionar widgets personalizáveis
   - Implementar notificações em tempo real
   - Adicionar resumo de tarefas pendentes
