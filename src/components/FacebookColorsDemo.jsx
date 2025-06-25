import React from 'react';

export function FacebookColorsDemo() {
  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-4">Paleta de Cores do Facebook</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cores do Facebook */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Cores Principais</h3>
          
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <div className="w-24 h-12 bg-facebook-primary rounded-md"></div>
              <div className="ml-4">
                <p className="font-medium">Azul Principal</p>
                <p className="text-sm text-gray-500">bg-facebook-primary</p>
                <p className="text-xs text-gray-400">#1877F2</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-24 h-12 bg-facebook-grey rounded-md"></div>
              <div className="ml-4">
                <p className="font-medium">Cinza</p>
                <p className="text-sm text-gray-500">bg-facebook-grey</p>
                <p className="text-xs text-gray-400">#898F9C</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-24 h-12 bg-facebook-light rounded-md"></div>
              <div className="ml-4">
                <p className="font-medium">Cinza Claro</p>
                <p className="text-sm text-gray-500">bg-facebook-light</p>
                <p className="text-xs text-gray-400">#EDF0F5</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-24 h-12 bg-facebook-dark rounded-md"></div>
              <div className="ml-4">
                <p className="font-medium">Cinza Escuro</p>
                <p className="text-sm text-gray-500">bg-facebook-dark</p>
                <p className="text-xs text-gray-400">#333333</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Exemplos de uso */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Exemplo de Uso</h3>
          
          <div className="p-6 bg-facebook-light rounded-lg border border-facebook-grey">
            <h4 className="text-facebook-dark font-bold text-lg">Card estilo Facebook</h4>
            <p className="text-facebook-grey mt-2">Este é um exemplo de card usando as cores do Facebook.</p>
            <button className="mt-4 bg-facebook-primary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
              Botão Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 