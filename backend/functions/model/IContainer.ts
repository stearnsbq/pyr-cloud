
import Docker from 'dockerode';

export interface IContainer{
    container: Docker.Container,
    lastInvoke: Date
}