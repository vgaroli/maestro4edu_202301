export interface DadoBoletim {
  texto: string
  estilo: string
  idPlanilha?: string
  idPaginaFinal?: string
  formato?: string
}

export interface DadosAprendizagem{
  texto: string
  estilo: string
  formato: string
  click?: string
}

export interface Boletim{
  aluno: string
  conta: string
  idDisciplina: string
  idGoogle: string
  idSala: string
  linhaBoletim: DadoBoletim[]
  nomeDisciplina: string
  nomeSala: string
  resultado: string
}

export interface Cabecalho {
  id: string
  colunas: number
  cabecalho: DadoBoletim[]
}

export interface Disciplina {
  id?: string
  nome: string
}

export interface DadosDisciplinaBoletim {
  disciplina: string,
  idDiario: string,
  idPaginaFinal: string,
  nota1: number,
  media1: number,
  faltas1: number,
  nota2: number,
  media2: number,
  faltas2: number,
  nota3: number,
  media3: number,
  faltas3: number,
  totalFaltas: number,
  percFreq: number,
  pontos: number,
  mediaAnual: number,
  recuperacao: number,
  mediaFinal1: number,
  segundaProva: number,
  mediaFinal2: number,
  resultado: string
}


//Legado 2020
export interface BoletimAluno {
  aluno: string,
  grade: string,
  idGoogle?: string,
  notas: DadosDisciplinaBoletim[]
}

export interface Boletim2020 {
  id?: string,
  aluno: string,
  grade: string,
  idGoogle: string,
  idDiario?: string,
  idPaginaFinal?: string,
  professores: string[],
  nome: string,
  sigla: string,
  notas: [
    { etapa: string, nota: number, media: number, faltas: number },
    { etapa: string, nota: number, media: number, faltas: number },
    { etapa: string, nota: number, media: number, faltas: number }
  ],
  totalFaltas: number,
  totalPontos: number,
  percentualFaltas: number,
  percentualFrequencia: number,
  mediaAnual: number,
  recuperacao: number,
  mediaFinal1: number,
  segundaProva: number,
  mediaFinal2: number,
  resultado: string,
}
