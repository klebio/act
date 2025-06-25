import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Upload, Download, History, User, LogOut, Settings, Copy, FileText, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';
import TransposerEngine from '@/utils/transposer';
import AuthModal from '@/components/AuthModal';
import HistoryModal from '@/components/HistoryModal';
import { FacebookColorsDemo } from '@/components/FacebookColorsDemo';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [inputMethod, setInputMethod] = useState('text'); // 'text' or 'file'
  const [chordsInput, setChordsInput] = useState('');
  const [originalKey, setOriginalKey] = useState('C');
  const [targetKey, setTargetKey] = useState('D');
  const [transposedChords, setTransposedChords] = useState('');
  const [isTransposing, setIsTransposing] = useState(false);
  const [accidentalPreference, setAccidentalPreference] = useState('sharp'); // 'sharp' or 'flat'
  const [autoDetectKey, setAutoDetectKey] = useState(false);

  const keys = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'];

  useEffect(() => {
    const savedUser = localStorage.getItem('saleiroUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('saleiroUser', JSON.stringify(userData));
    setShowAuthModal(false);
    toast({
      title: "Login realizado!",
      description: `Bem-vindo de volta, ${userData.name}!`,
    });
  };

  const handleRegister = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('saleiroUser', JSON.stringify(userData));
    setShowAuthModal(false);
    toast({
      title: "Conta criada!",
      description: `Bem-vindo ao Saleiro Music, ${userData.name}!`,
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('saleiroUser');
    toast({
      title: "Logout realizado",
      description: "Até logo! Volte sempre.",
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setChordsInput(e.target.result);
        
        // Auto-detecção de tonalidade para arquivos também
        if (autoDetectKey) {
          try {
            const transposer = new TransposerEngine();
            const detectedKey = transposer.detectKey(e.target.result);
            setOriginalKey(detectedKey);
          } catch (error) {
            console.error("Erro na detecção de tonalidade:", error);
          }
        }
        
        toast({
          title: "Arquivo carregado!",
          description: "Acordes importados com sucesso.",
        });
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Erro no arquivo",
        description: "Por favor, selecione um arquivo .txt válido.",
        variant: "destructive",
      });
    }
  };

  const handleChordsInputChange = (e) => {
    const value = e.target.value;
    setChordsInput(value);
    
    // Auto-detecção de tonalidade
    if (autoDetectKey && value.trim()) {
      try {
        const transposer = new TransposerEngine();
        const detectedKey = transposer.detectKey(value);
        setOriginalKey(detectedKey);
      } catch (error) {
        console.error("Erro na detecção de tonalidade:", error);
      }
    }
  };

  const handleTranspose = async () => {
    if (!chordsInput.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira alguns acordes para transpor.",
        variant: "destructive",
      });
      return;
    }

    setIsTransposing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula processamento
      
      const transposer = new TransposerEngine();
      const result = transposer.transpose(chordsInput, originalKey, targetKey, accidentalPreference);
      
      setTransposedChords(result);
      
      // Salvar no histórico se usuário estiver logado
      if (currentUser) {
        const historyItem = {
          id: Date.now(),
          date: new Date().toISOString(),
          originalKey,
          targetKey,
          originalChords: chordsInput,
          transposedChords: result,
        };
        
        const existingHistory = JSON.parse(localStorage.getItem(`history_${currentUser.email}`) || '[]');
        const newHistory = [historyItem, ...existingHistory].slice(0, 50); // Manter apenas 50 itens
        localStorage.setItem(`history_${currentUser.email}`, JSON.stringify(newHistory));
      }
      
      toast({
        title: "Transposição concluída!",
        description: `Acordes transpostos de ${originalKey} para ${targetKey}`,
      });
    } catch (error) {
      toast({
        title: "Erro na transposição",
        description: "Ocorreu um erro ao transpor os acordes. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsTransposing(false);
    }
  };

  const handleCopyResult = () => {
    navigator.clipboard.writeText(transposedChords);
    toast({
      title: "Copiado!",
      description: "Acordes transpostos copiados para a área de transferência.",
    });
  };

  const handleDownloadResult = () => {
    const blob = new Blob([transposedChords], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `acordes_transpostos_${originalKey}_para_${targetKey}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download iniciado!",
      description: "Arquivo com acordes transpostos baixado.",
    });
  };

  const clearAll = () => {
    setChordsInput('');
    setTransposedChords('');
    toast({
      title: "Limpo!",
      description: "Todos os campos foram limpos.",
    });
  };

  return (
    <div className="min-h-screen bg-facebook-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-10 h-10 bg-facebook-primary rounded-md flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-display text-facebook-primary">
                  Saleiro Music
                </h1>
                <p className="text-sm text-facebook-grey">Transposição de Acordes</p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-3">
              {currentUser ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHistoryModal(true)}
                    className="text-facebook-primary hover:bg-facebook-light"
                  >
                    <History className="w-4 h-4 mr-2" />
                    Histórico
                  </Button>
                  <div className="flex items-center space-x-2 px-3 py-2 bg-facebook-light rounded-lg">
                    <User className="w-4 h-4 text-facebook-primary" />
                    <span className="text-sm font-medium text-facebook-dark">{currentUser.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-facebook-primary text-white hover:bg-facebook-primary/90 px-4 py-2 rounded-md"
                >
                  <User className="w-4 h-4 mr-2" />
                  Entrar
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Transponha seus acordes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Mude a tonalidade de suas músicas de forma rápida e precisa. 
              Perfeito para músicos de todos os níveis!
            </p>
          </motion.div>

          {/* Input Method Selection */}
          <motion.div 
            className="chord-card mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-purple-800">Como você quer inserir os acordes?</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => setInputMethod('text')}
                variant={inputMethod === 'text' ? 'default' : 'outline'}
                className={inputMethod === 'text' ? 'btn-primary' : 'btn-secondary'}
              >
                <FileText className="w-4 h-4 mr-2" />
                Digitar acordes
              </Button>
              <Button
                onClick={() => setInputMethod('file')}
                variant={inputMethod === 'file' ? 'default' : 'outline'}
                className={inputMethod === 'file' ? 'btn-primary' : 'btn-secondary'}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload de arquivo .txt
              </Button>
            </div>
          </motion.div>

          {/* Input Section */}
          <motion.div 
            className="chord-card mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-purple-800">
              {inputMethod === 'text' ? 'Digite os acordes' : 'Faça upload do arquivo'}
            </h3>
            
            {inputMethod === 'text' ? (
              <textarea
                value={chordsInput}
                onChange={handleChordsInputChange}
                placeholder="Digite os acordes aqui... Ex: C | Am | F | G"
                className="input-music min-h-[120px] resize-none"
                rows={5}
              />
            ) : (
              <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center hover:border-purple-500 transition-colors">
                <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Arraste um arquivo .txt ou clique para selecionar</p>
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="btn-secondary cursor-pointer inline-block">
                  Selecionar arquivo
                </label>
              </div>
            )}
            
            {chordsInput && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-700">
                  <strong>Prévia:</strong> {chordsInput.substring(0, 100)}
                  {chordsInput.length > 100 && '...'}
                </p>
              </div>
            )}
          </motion.div>

          {/* Transposition Settings */}
          <motion.div 
            className="chord-card mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-purple-800">Configurações de transposição</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tonalidade atual
                </label>
                <div className="space-y-2">
                  <select
                    value={originalKey}
                    onChange={(e) => setOriginalKey(e.target.value)}
                    className="input-music"
                    disabled={autoDetectKey}
                  >
                    {keys.map(key => (
                      <option key={key} value={key.split('/')[0]}>{key}</option>
                    ))}
                  </select>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="auto-detect"
                      checked={autoDetectKey}
                      onChange={() => setAutoDetectKey(!autoDetectKey)}
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="auto-detect" className="text-xs text-gray-600">
                      Detectar automaticamente
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nova tonalidade
                </label>
                <select
                  value={targetKey}
                  onChange={(e) => setTargetKey(e.target.value)}
                  className="input-music"
                >
                  {keys.map(key => (
                    <option key={key} value={key.split('/')[0]}>{key}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferência de acidentes
                </label>
                <select
                  value={accidentalPreference}
                  onChange={(e) => setAccidentalPreference(e.target.value)}
                  className="input-music"
                >
                  <option value="sharp">Sustenidos (#)</option>
                  <option value="flat">Bemóis (♭)</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleTranspose}
                disabled={isTransposing || !chordsInput.trim()}
                className="btn-primary flex-1"
              >
                {isTransposing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Transpondendo...
                  </>
                ) : (
                  <>
                    <Music className="w-4 h-4 mr-2" />
                    Transpor acordes
                  </>
                )}
              </Button>
              
              <Button
                onClick={clearAll}
                variant="outline"
                className="btn-secondary"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Limpar tudo
              </Button>
            </div>
          </motion.div>

          {/* Results Section */}
          <AnimatePresence>
            {transposedChords && (
              <motion.div 
                className="chord-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-xl font-semibold mb-4 text-purple-800">Resultado da transposição</h3>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-purple-700">
                      {originalKey} → {targetKey}
                    </span>
                    <span className="text-xs text-gray-500">
                      {accidentalPreference === 'sharp' ? 'Sustenidos' : 'Bemóis'}
                    </span>
                  </div>
                  <pre className="whitespace-pre-wrap font-mono text-lg text-gray-800 leading-relaxed">
                    {transposedChords}
                  </pre>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleCopyResult}
                    className="btn-secondary flex-1"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar resultado
                  </Button>
                  
                  <Button
                    onClick={handleDownloadResult}
                    className="btn-secondary flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar arquivo
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Facebook Colors Demo */}
          <motion.div 
            className="chord-card mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <FacebookColorsDemo />
          </motion.div>
        </div>
      </main>

      {/* Floating Elements */}
      <div className="fixed top-20 left-10 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-float" />
      <div className="fixed bottom-20 right-10 w-16 h-16 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full opacity-20 animate-float-delayed" />
      <div className="fixed top-1/2 right-20 w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-bounce-slow" />

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
      
      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        currentUser={currentUser}
      />

      <Toaster />
    </div>
  );
}

export default App;
