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
