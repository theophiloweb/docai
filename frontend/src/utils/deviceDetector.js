/**
 * Utilitário para detectar o tipo de dispositivo
 * 
 * Este módulo fornece funções para detectar o tipo de dispositivo do usuário.
 * 
 * @author Doc.AI Team
 */

/**
 * Verifica se o dispositivo é móvel
 * @returns {boolean} true se for dispositivo móvel, false caso contrário
 */
export const isMobileDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Verificar se é um dispositivo móvel baseado no user agent
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  
  return mobileRegex.test(userAgent) || (window.innerWidth <= 768);
};

/**
 * Verifica se o dispositivo tem câmera
 * @returns {Promise<boolean>} Promise que resolve para true se o dispositivo tiver câmera
 */
export const hasCamera = async () => {
  try {
    // Verificar se a API de mídia está disponível
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return false;
    }
    
    // Enumerar dispositivos de mídia
    const devices = await navigator.mediaDevices.enumerateDevices();
    
    // Verificar se há algum dispositivo de vídeo (câmera)
    return devices.some(device => device.kind === 'videoinput');
  } catch (error) {
    console.error('Erro ao verificar câmera:', error);
    return false;
  }
};

export default {
  isMobileDevice,
  hasCamera
};
