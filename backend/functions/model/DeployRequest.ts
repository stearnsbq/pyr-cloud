export interface DeployRequest{
    sourceCodeURL: string,
    environment: 'nodejs' | 'python',
}