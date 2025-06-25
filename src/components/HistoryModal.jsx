
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, History, Eye, Copy, Download, Trash2, Calendar, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const HistoryModal = ({ isOpen, onClose, currentUser }) => {
  const [history, setHistory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (currentUser && isOpen) {
      const userHistory = JSON.parse(localStorage.getItem(`history_${currentUser.email}`) || '[]');
      setHistory(userHistory);
    }
  }, [currentUser, isOpen]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewItem = (item) => {
    setSelectedItem(item);
  };

  const handleCopyChords = (chords) => {
    navigator.clipboard.writeText(chords);
    toast({
      title: "Copiado!",
      description: "Acordes copiados para a área de transferência.",
    });
  };

  const handleDownloadChords = (item) => {
    const content = `Transposição: ${item.originalKey} → ${item.targetKey}\n\nAcordes originais:\n${item.originalChords}\n\nAcordes transpostos:\n${item.transposedChords}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transposicao_${item.originalKey}_para_${item.targetKey}_${new Date(item.date).toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download iniciado!",
      description: "Arquivo baixado com sucesso.",
    });
  };

  const handleDeleteItem = (itemId) => {
    const updatedHistory = history.filter(item => item.id !== itemId);
    setHistory(updatedHistory);
    localStorage.setItem(`history_${currentUser.email}`, JSON.stringify(updatedHistory));
    
    if (selectedItem && selectedItem.id === itemId) {
      setSelectedItem(null);
    }
    
    toast({
      title: "Item removido",
      description: "Item removido do histórico.",
    });
  };

  const clearAllHistory = () => {
    setHistory([]);
    setSelectedItem(null);
    localStorage.removeItem(`history_${currentUser.email}`);
    
    toast({
      title: "Histórico limpo",
      description: "Todo o histórico foi removido.",
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <History className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white font-display">
                  Histórico de Transposições
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="flex h-[calc(90vh-80px)]">
            {/* Lista do histórico */}
            <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">
                    {history.length} transposições
                  </h3>
                  {history.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllHistory}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Limpar tudo
                    </Button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div className="text-center py-12">
                    <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma transposição no histórico</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Suas transposições aparecerão aqui
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <motion.div
                        key={item.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedItem?.id === item.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                        }`}
                        onClick={() => handleViewItem(item)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-purple-600">
                              {item.originalKey} → {item.targetKey}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteItem(item.id);
                            }}
                            className="text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(item.date)}
                        </div>
                        
                        <p className="text-sm text-gray-600 truncate">
                          {item.originalChords.substring(0, 50)}
                          {item.originalChords.length > 50 && '...'}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Detalhes do item selecionado */}
            <div className="w-1/2 overflow-y-auto">
              {selectedItem ? (
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">
                      Transposição: {selectedItem.originalKey} → {selectedItem.targetKey}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(selectedItem.date)}
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Acordes originais */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-800">
                          Acordes originais ({selectedItem.originalKey})
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyChords(selectedItem.originalChords)}
                          className="text-purple-600 hover:bg-purple-50"
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copiar
                        </Button>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">
                          {selectedItem.originalChords}
                        </pre>
                      </div>
                    </div>

                    {/* Acordes transpostos */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-800">
                          Acordes transpostos ({selectedItem.targetKey})
                        </h4>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyChords(selectedItem.transposedChords)}
                            className="text-purple-600 hover:bg-purple-50"
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            Copiar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadChords(selectedItem)}
                            className="text-purple-600 hover:bg-purple-50"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Baixar
                          </Button>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                        <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">
                          {selectedItem.transposedChords}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Selecione um item para ver os detalhes</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default HistoryModal;
