import React, { useState, useEffect, useRef } from 'react';
import { ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
// import api from '../services/api';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Olá! Sou o assistente virtual do Doc.AI. Como posso ajudar você hoje?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Sugestões de perguntas frequentes
  const suggestions = [
    'Como funciona o Doc.AI?',
    'Quais são os planos disponíveis?',
    'Como faço para me cadastrar?',
    'O Doc.AI é seguro?',
    'Como funciona a análise de documentos?'
  ];

  // Rolar para o final da conversa quando novas mensagens são adicionadas
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Alternar visibilidade do chatbot
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  // Enviar mensagem
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Adicionar mensagem do usuário
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    try {
      // Em produção, descomentar a linha abaixo
      // const response = await api.post('/chatbot', { message: inputValue });
      
      // Simulação de resposta do chatbot
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let botResponse;
      
      // Respostas simuladas baseadas em palavras-chave
      if (inputValue.toLowerCase().includes('plano') || inputValue.toLowerCase().includes('preço')) {
        botResponse = 'Oferecemos três planos: Gratuito (teste por 30 dias), Premium (R$100/ano) e Familiar (R$200/ano para até 5 membros). Cada plano inclui diferentes níveis de acesso e recursos. Posso detalhar mais algum plano específico?';
      } else if (inputValue.toLowerCase().includes('seguro') || inputValue.toLowerCase().includes('privacidade')) {
        botResponse = 'Sim, o Doc.AI foi desenvolvido com segurança e privacidade como prioridades. Seguimos rigorosamente a LGPD, utilizamos criptografia de ponta a ponta e você tem controle total sobre seus dados. Seus documentos são armazenados de forma segura e nunca compartilhados sem sua autorização explícita.';
      } else if (inputValue.toLowerCase().includes('cadastr') || inputValue.toLowerCase().includes('registr')) {
        botResponse = 'Para se cadastrar, clique no botão "Cadastrar" no canto superior direito da página. Você precisará fornecer algumas informações básicas como nome, e-mail e criar uma senha. O processo é rápido e você poderá começar a usar o sistema imediatamente!';
      } else if (inputValue.toLowerCase().includes('funciona')) {
        botResponse = 'O Doc.AI permite que você faça upload de seus documentos pessoais, que são então processados por nossa IA para extrair informações importantes. Você pode organizar documentos por categorias, buscar por conteúdo específico e obter insights valiosos. Tudo isso de forma segura e em conformidade com a LGPD.';
      } else if (inputValue.toLowerCase().includes('documento') || inputValue.toLowerCase().includes('análise')) {
        botResponse = 'Nossa tecnologia de IA analisa seus documentos para extrair informações relevantes, como datas, valores e termos importantes. Por exemplo, em documentos médicos, podemos identificar diagnósticos, medicamentos e resultados de exames, criando um histórico organizado e fácil de consultar.';
      } else {
        botResponse = 'Obrigado pela sua mensagem! Estou aqui para ajudar com informações sobre o Doc.AI, nossos planos, funcionalidades e como começar a usar. Tem alguma dúvida específica sobre nosso serviço?';
      }
      
      // Adicionar resposta do bot
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem para o chatbot:', error);
      
      // Mensagem de erro
      const errorMessage = {
        id: messages.length + 2,
        text: 'Desculpe, tive um problema ao processar sua mensagem. Pode tentar novamente?',
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Usar sugestão
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    handleSendMessage({ preventDefault: () => {} });
  };

  // Formatar timestamp
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Botão do chatbot */}
      <button
        onClick={toggleChatbot}
        className={`${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-primary-500 hover:bg-primary-600'
        } rounded-full p-4 text-white shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        )}
      </button>

      {/* Janela do chatbot */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden transition-all duration-300 transform origin-bottom-right">
          {/* Cabeçalho */}
          <div className="bg-primary-500 text-white p-4">
            <div className="flex items-center">
              <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2" />
              <div>
                <h3 className="font-medium">Assistente Doc.AI</h3>
                <p className="text-xs text-primary-100">Online</p>
              </div>
            </div>
          </div>

          {/* Mensagens */}
          <div className="h-80 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-700">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3/4 rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-primary-500 text-white'
                      : 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-primary-100' : 'text-gray-500 dark:text-gray-300'
                  }`}>
                    {formatTimestamp(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="mb-4 flex justify-start">
                <div className="max-w-3/4 rounded-lg px-4 py-2 bg-white dark:bg-gray-600 text-gray-800 dark:text-white">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-300 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-300 animate-bounce delay-100"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-300 animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Sugestões */}
          {messages.length < 3 && (
            <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 overflow-x-auto whitespace-nowrap">
              <div className="flex space-x-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 whitespace-nowrap"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Formulário de entrada */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="bg-primary-500 hover:bg-primary-600 text-white rounded-r-md px-4 py-2 disabled:opacity-50"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Este chatbot utiliza IA para responder suas perguntas sobre o Doc.AI.
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
