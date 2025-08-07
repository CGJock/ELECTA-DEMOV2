import React, { useState, useEffect } from 'react';
import { Settings, Key, Globe, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { translationService } from '@/services/translationService';
import { useTranslation } from 'react-i18next';

interface TranslationConfigProps {
  isOpen: boolean;
  onClose: () => void;
}

const TranslationConfig: React.FC<TranslationConfigProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [apiKey, setApiKey] = useState('');
  const [region, setRegion] = useState('global');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Verificar si ya está configurado
    setIsConfigured(translationService.isConfigured());
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      translationService.setApiKey(apiKey.trim());
      translationService.setRegion(region);
      setIsConfigured(true);
      setTestResult({ success: true, message: 'Configuración guardada exitosamente' });
      
      // Guardar en localStorage para persistencia
      localStorage.setItem('microsoft-translator-key', apiKey.trim());
      localStorage.setItem('microsoft-translator-region', region);
    }
  };

  const handleTest = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: 'Por favor ingresa una API key primero' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      // Configurar temporalmente para la prueba
      translationService.setApiKey(apiKey.trim());
      translationService.setRegion(region);

      // Probar con un texto simple
      const testText = 'Hola mundo';
      const translatedText = await translationService.translateText(testText, 'en', 'es');
      
      if (translatedText && translatedText !== testText) {
        setTestResult({ success: true, message: `Prueba exitosa: "${testText}" → "${translatedText}"` });
      } else {
        setTestResult({ success: false, message: 'La traducción no funcionó correctamente' });
      }
    } catch (error) {
      setTestResult({ 
        success: false, 
        message: `Error en la prueba: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleReset = () => {
    setApiKey('');
    setRegion('global');
    setIsConfigured(false);
    setTestResult(null);
    translationService.setApiKey('');
    localStorage.removeItem('microsoft-translator-key');
    localStorage.removeItem('microsoft-translator-region');
  };

  // Cargar configuración guardada al abrir
  useEffect(() => {
    if (isOpen) {
      const savedKey = localStorage.getItem('microsoft-translator-key');
      const savedRegion = localStorage.getItem('microsoft-translator-region');
      
      if (savedKey) {
        setApiKey(savedKey);
      }
      if (savedRegion) {
        setRegion(savedRegion);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-lg border border-[#374151] shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="text-cyan-400" size={20} />
            Configuración de Traducción
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XCircle size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Estado actual */}
          <div className={`p-3 rounded-lg border ${
            isConfigured 
              ? 'bg-green-900/20 border-green-400' 
              : 'bg-yellow-900/20 border-yellow-400'
          }`}>
            <div className="flex items-center gap-2">
              {isConfigured ? (
                <CheckCircle className="text-green-400" size={16} />
              ) : (
                <AlertTriangle className="text-yellow-400" size={16} />
              )}
              <span className="text-sm text-white">
                {isConfigured ? 'Servicio configurado' : 'Servicio no configurado'}
              </span>
            </div>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
              <Key className="text-cyan-400" size={16} />
              Microsoft Translator API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#1E293B] border border-[#374151] text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Ingresa tu API key de Microsoft Translator"
            />
            <p className="text-xs text-gray-400 mt-1">
              Obtén tu API key gratuita en{' '}
              <a 
                href="https://azure.microsoft.com/en-us/services/cognitive-services/translator/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline"
              >
                Azure Cognitive Services
              </a>
            </p>
          </div>

          {/* Región */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
              <Globe className="text-cyan-400" size={16} />
              Región de Azure
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#1E293B] border border-[#374151] text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="global">Global</option>
              <option value="eastus">East US</option>
              <option value="westus">West US</option>
              <option value="westus2">West US 2</option>
              <option value="eastus2">East US 2</option>
              <option value="centralus">Central US</option>
              <option value="northcentralus">North Central US</option>
              <option value="southcentralus">South Central US</option>
              <option value="westcentralus">West Central US</option>
            </select>
          </div>

          {/* Resultado de prueba */}
          {testResult && (
            <div className={`p-3 rounded-lg border ${
              testResult.success 
                ? 'bg-green-900/20 border-green-400' 
                : 'bg-red-900/20 border-red-400'
            }`}>
              <div className="flex items-center gap-2">
                {testResult.success ? (
                  <CheckCircle className="text-green-400" size={16} />
                ) : (
                  <XCircle className="text-red-400" size={16} />
                )}
                <span className="text-sm text-white">{testResult.message}</span>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-2 pt-4">
            <button
              onClick={handleTest}
              disabled={isTesting || !apiKey.trim()}
              className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isTesting ? 'Probando...' : 'Probar Conexión'}
            </button>
            <button
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded font-medium transition-colors"
            >
              Guardar
            </button>
          </div>

          {isConfigured && (
            <button
              onClick={handleReset}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors"
            >
              Resetear Configuración
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranslationConfig; 