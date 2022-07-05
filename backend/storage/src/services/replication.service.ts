import { Injectable } from "@pyrjs/core";
import k8s from '@kubernetes/client-node';

@Injectable()
export class ReplicationService{

    private otherServers: string[];

    constructor(){

        const kc = new k8s.KubeConfig();
        kc.loadFromCluster();


        const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

        
        k8sApi.listNamespacedPod('bucket')
            .then((res) => {
            console.log(res.body);
            })
            .catch((err) => {
                console.log(err);
            });

        
    }


}