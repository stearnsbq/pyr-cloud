export interface FunctionRequest{
    sourceCodeURL: string,
    environment: 'nodejs' | 'python',
    timeout: number,
    event: any
}