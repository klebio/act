class TransposerEngine {
  constructor() {
    // Mapeamento de notas com sustenidos e bemóis
    this.chromaticScale = [
      'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
    ];
    
    this.chromaticScaleFlats = [
      'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'
    ];
    
    // Mapeamento de equivalências entre sustenidos e bemóis
    this.enharmonicMap = {
      'C#': 'Db', 'Db': 'C#',
      'D#': 'Eb', 'Eb': 'D#',
      'F#': 'Gb', 'Gb': 'F#',
      'G#': 'Ab', 'Ab': 'G#',
      'A#': 'Bb', 'Bb': 'A#'
    };
    
    // Regex para identificar acordes (melhorada para capturar acordes com baixo)
    // Formato: Nota + sufixo opcional + barra opcional + nota do baixo opcional
    this.chordRegex = /([A-G][#b]?)([^A-G#b\/\s]*)(?:\/([A-G][#b]?))?/g;
  }
  
  /**
   * Normaliza uma nota para o formato padrão
   */
  normalizeNote(note) {
    // Remove espaços e converte para maiúscula
    note = note.trim().toUpperCase();
    
    // Converte bemóis alternativos
    note = note.replace('♭', 'b').replace('♯', '#');
    
    return note;
  }
  
  /**
   * Calcula a diferença em semitons entre duas notas
   */
  calculateSemitones(fromKey, toKey) {
    fromKey = this.normalizeNote(fromKey);
    toKey = this.normalizeNote(toKey);
    
    // Lidar com tonalidades compostas (C#/Db)
    if (fromKey.includes('/')) fromKey = fromKey.split('/')[0];
    if (toKey.includes('/')) toKey = toKey.split('/')[0];
    
    // Encontra o índice das notas na escala cromática
    let fromIndex = this.chromaticScale.indexOf(fromKey);
    if (fromIndex === -1) {
      fromIndex = this.chromaticScaleFlats.indexOf(fromKey);
    }
    
    let toIndex = this.chromaticScale.indexOf(toKey);
    if (toIndex === -1) {
      toIndex = this.chromaticScaleFlats.indexOf(toKey);
    }
    
    if (fromIndex === -1 || toIndex === -1) {
      throw new Error(`Nota inválida: ${fromKey} ou ${toKey}`);
    }
    
    // Calcula a diferença
    let semitones = toIndex - fromIndex;
    if (semitones < 0) {
      semitones += 12;
    }
    
    return semitones;
  }
  
  /**
   * Transpõe uma nota individual
   */
  transposeNote(note, semitones, useFlats = false) {
    note = this.normalizeNote(note);
    
    // Encontra o índice da nota
    let noteIndex = this.chromaticScale.indexOf(note);
    if (noteIndex === -1) {
      noteIndex = this.chromaticScaleFlats.indexOf(note);
    }
    
    if (noteIndex === -1) {
      return note; // Retorna a nota original se não encontrar
    }
    
    // Calcula o novo índice
    let newIndex = (noteIndex + semitones) % 12;
    
    // Retorna a nota transposta
    if (useFlats) {
      return this.chromaticScaleFlats[newIndex];
    } else {
      return this.chromaticScale[newIndex];
    }
  }
  
  /**
   * Transpõe um acorde individual
   */
  transposeChord(chord, semitones, useFlats = false) {
    return chord.replace(this.chordRegex, (match, root, suffix, bass) => {
      const transposedRoot = this.transposeNote(root, semitones, useFlats);
      
      // Se tiver baixo, transpõe também
      if (bass) {
        const transposedBass = this.transposeNote(bass, semitones, useFlats);
        return transposedRoot + suffix + '/' + transposedBass;
      }
      
      return transposedRoot + suffix;
    });
  }
  
  /**
   * Função principal de transposição
   */
  transpose(input, fromKey, toKey, accidentalPreference = 'sharp') {
    try {
      // Calcula os semitons de diferença
      const semitones = this.calculateSemitones(fromKey, toKey);
      const useFlats = accidentalPreference === 'flat';
      
      // Divide o input em linhas para preservar a formatação
      const lines = input.split('\n');
      
      // Transpõe cada linha
      const transposedLines = lines.map(line => {
        // Se a linha contém acordes (tem letras maiúsculas seguidas de possíveis modificadores)
        if (/[A-G][#b]?/.test(line)) {
          return this.transposeChord(line, semitones, useFlats);
        }
        // Se não contém acordes, retorna a linha original (pode ser letra da música)
        return line;
      });
      
      return transposedLines.join('\n');
      
    } catch (error) {
      console.error('Erro na transposição:', error);
      throw new Error('Erro ao transpor os acordes. Verifique se as tonalidades são válidas.');
    }
  }
  
  /**
   * Valida se uma string contém acordes válidos
   */
  validateChords(input) {
    const chordMatches = input.match(this.chordRegex);
    return chordMatches && chordMatches.length > 0;
  }
  
  /**
   * Extrai todos os acordes únicos de um texto
   */
  extractChords(input) {
    const matches = input.match(this.chordRegex) || [];
    return [...new Set(matches)].sort();
  }
  
  /**
   * Detecta a tonalidade provável baseada nos acordes presentes
   * Implementação simplificada
   */
  detectKey(input) {
    const chords = this.extractChords(input);
    
    if (chords.length === 0) return 'C';
    
    // Implementação básica: assume que o primeiro acorde é a tonalidade
    // Em uma implementação real, seria necessário analisar os padrões de acordes
    const firstChord = chords[0];
    const rootNote = firstChord.match(/^[A-G][#b]?/)[0];
    
    return rootNote;
  }
}

export default TransposerEngine;
