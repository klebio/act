# Documentação do Saleiro Music

## Visão Geral

Saleiro Music é uma aplicação web para transposição de acordes musicais. Ela permite aos músicos mudar a tonalidade de suas músicas de forma rápida e precisa, facilitando a adaptação de partituras para diferentes instrumentos ou vozes.

## Funcionalidades Principais

### 1. Transposição de Acordes
- Transposição de acordes entre qualquer tonalidade
- Suporte para acordes complexos (com baixo, extensões, etc.)
- Opção de preferência entre sustenidos (#) e bemóis (♭)

### 2. Entrada de Dados Flexível
- Entrada direta de texto
- Upload de arquivos .txt com acordes

### 3. Sistema de Usuários
- Cadastro e login simplificados
- Armazenamento local das informações do usuário

### 4. Histórico de Transposições
- Salvamento automático de transposições para usuários logados
- Visualização do histórico completo
- Filtragem por tonalidade
- Ordenação por data (mais recentes/mais antigos)

### 5. Exportação
- Cópia para área de transferência
- Download como arquivo de texto

## Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript puro
- **Armazenamento**: LocalStorage
- **Design**: Estilo visual inspirado no Facebook

## Arquitetura do Projeto

### Estrutura de Arquivos
```
saleiro-music/
├── index.html       # Página principal com HTML, CSS e JavaScript
├── doc.md          # Esta documentação
```

### Componentes Principais

#### 1. TransposerEngine
Classe responsável pela lógica de transposição de acordes:
- Mapeamento de notas e escalas cromáticas
- Detecção de acordes via expressões regulares
- Cálculo de intervalos entre tonalidades
- Transposição preservando a formatação original

#### 2. Interface de Usuário
- Layout responsivo
- Formulário de entrada de acordes
- Seletores de tonalidade
- Área de resultado
- Modais para login e histórico

#### 3. Sistema de Armazenamento
- Gerenciamento de usuários via LocalStorage
- Histórico de transposições por usuário
- Persistência entre sessões

## Fluxo de Uso

1. **Entrada de Dados**:
   - O usuário insere acordes manualmente ou faz upload de um arquivo
   - Seleciona a tonalidade atual e a tonalidade desejada
   - Escolhe a preferência de acidentes (sustenidos ou bemóis)

2. **Processamento**:
   - O sistema analisa os acordes inseridos
   - Calcula a diferença de semitons entre as tonalidades
   - Aplica a transposição preservando o formato e a estrutura

3. **Resultado**:
   - Exibe os acordes transpostos
   - Oferece opções para copiar ou baixar o resultado
   - Salva no histórico (se o usuário estiver logado)

## Guia de Cores

O projeto utiliza a paleta de cores do Facebook:

| Cor | Hex | Uso |
|-----|-----|-----|
| Azul Principal | #1877F2 | Botões primários, links, destaques |
| Cinza | #898F9C | Textos secundários, ícones |
| Cinza Claro | #EDF0F5 | Fundo da página, áreas de resultado |
| Cinza Escuro | #333333 | Textos principais |
| Branco | #FFFFFF | Fundo de cards, contraste |

## Detalhes Técnicos

### Algoritmo de Transposição

O algoritmo de transposição segue estes passos:

1. **Normalização**: Padroniza a representação dos acordes
2. **Cálculo de Intervalo**: Determina a diferença em semitons entre as tonalidades
3. **Mapeamento**: Transpõe cada nota de acordo com o intervalo calculado
4. **Preservação**: Mantém sufixos, extensões e notas de baixo intactos

```javascript
// Exemplo simplificado do algoritmo
function transposeChord(chord, semitones, useFlats) {
  return chord.replace(/([A-G][#b]?)([^\/]*)(\/([A-G][#b]?))?/, (match, root, suffix, _, bass) => {
    const transposedRoot = transposeNote(root, semitones, useFlats);
    if (bass) {
      const transposedBass = transposeNote(bass, semitones, useFlats);
      return transposedRoot + suffix + '/' + transposedBass;
    }
    return transposedRoot + suffix;
  });
}
```

### Sistema de Armazenamento

O sistema utiliza o LocalStorage do navegador para:

1. **Dados do Usuário**:
   ```javascript
   // Armazenamento
   localStorage.setItem('saleiroUser', JSON.stringify(userData));
   
   // Recuperação
   const user = JSON.parse(localStorage.getItem('saleiroUser'));
   ```

2. **Histórico de Transposições**:
   ```javascript
   // Formato do item no histórico
   const historyItem = {
     id: Date.now(),
     date: new Date().toISOString(),
     originalKey: 'C',
     targetKey: 'D',
     originalChords: 'C Am F G',
     transposedChords: 'D Bm G A'
   };
   ```

## Limitações Atuais e Possíveis Melhorias

### Limitações
- Armazenamento local (dados perdidos ao limpar o cache)
- Sem sincronização entre dispositivos
- Detecção automática de tonalidade simplificada

### Melhorias Futuras
- **Backend**: Implementar um servidor para armazenamento permanente
- **Detecção Inteligente**: Algoritmo mais sofisticado para detecção de tonalidade
- **Formatação Avançada**: Suporte para partituras completas (não apenas acordes)
- **Exportação**: Opções para PDF, imagem ou formatos de partituras digitais
- **Compartilhamento**: Funcionalidade para compartilhar transposições
- **Modo Offline**: Funcionamento completo sem conexão à internet

## Como Usar

1. **Acesso**: Abra o arquivo index.html em qualquer navegador moderno
2. **Entrada de Acordes**:
   - Digite os acordes diretamente na área de texto, ou
   - Faça upload de um arquivo .txt com os acordes
3. **Configuração**:
   - Selecione a tonalidade atual dos acordes
   - Escolha a tonalidade desejada
   - Defina sua preferência por sustenidos ou bemóis
4. **Transposição**: Clique no botão "Transpor acordes"
5. **Resultado**: Copie ou faça download dos acordes transpostos
6. **Histórico** (opcional):
   - Faça login para salvar suas transposições
   - Acesse o histórico para visualizar ou reutilizar transposições anteriores

## Licença

Este projeto está sob a licença MIT.

---

Documentação criada em: 2024
Última atualização: Junho de 2024
