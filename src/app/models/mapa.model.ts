export interface Cabecalho {
  id: string
  colunas: number
  cabecalho: DadoItem[]
}

export interface DadoItem {
  texto: string
  estilo: string
  idDocGoogle?: string
  idPagina?: string
  formato?: string
}

export interface ItemMapa{
  aluno: string
  conta: string
  idDisciplina: string
  idGoogle: string
  idSala: string
  linhaItem: DadoItem[]
  nomeDisciplina: string
  nomeSala: string
  resultado: string
  ordem?: string
  colecao?:string
}
