//----------------------------------------------------------
//    This should help you get a cluster created in a GCP
//    zone, create a local loadbalancer for the cluster,
//    deploy your nodejs website, and see it running in the
//    region.
//----------------------------------------------------------

// Create a new gloud config that points to our new project in GCP
gcloud init

// Create a GCE (Google Container Engine) cluster in three regions - us-west1 asia-northeast1  europe-west1
gcloud container clusters create simplelocation-cluster-us-west --zone us-west1-a --scopes "cloud-platform" --num-nodes 3

// Get the credentials for this cluster
gcloud container clusters get-credentials simplelocation-cluster-us-west --zone=us-west1-a

// We should now have a small cluster running on the west coast.

// Build the Docker container
// Note: the -t names the image.  The svcp-simplelocation part must match the gcloud project name you are using
docker build -t gcr.io/svcp-simplelocation/simplelocation .

// Test that it works locally (localhost:3000)
docker run -p 3000:3000 gcr.io/svcp-simplelocation/simplelocation

// Next - Push the container to GCloud
gcloud docker -- push gcr.io/svcp-simplelocation/simplelocation

// Now we want to Deploy the app, and create our loadbalancer
// We can do this in a single step:  It will create a service, and a deployment
kubectl create -f kubectl_system.yaml

// --- OR ------
// Do them independantly
kubectl create -f kubectl_deployment.yaml
kubectl create -f kubectt_service.yaml

// Check status
kubectl get deployments
kubectl get services
kubectl describe services simplelocation-svc

// The services part SHOULD give you an external IP Address:
// goto that  <ip address>:3000  and see if it works.

// Cool tools to clean up docker images
// Stop all containers
docker rm $(docker ps -a -q)

// Remove all intermedate container images
docker rmi $(docker images | grep "^<none>" | awk '{print $3}') --force

// Remove all svcp container images
docker rmi $(docker images | grep "svcp" | awk '{print $3}') --force


              |||||
              |||||
              |||||
              |||||
        |||||||||||||||||
          |||||||||||||
            |||||||||
              |||||
                |              

// Note:  You can also create clusters in other regions:  To do THAT....

// Create a Cluster in ASIA
gcloud container clusters create simplelocation-cluster-asia-ne --zone asia-northeast1-a --scopes "cloud-platform" --num-nodes 3
gcloud container clusters create simplelocation-cluster-europe --zone europe-west1-b --scopes "cloud-platform" --num-nodes 3

// Reinit your cloud stuff - switch your default cluster to asia-northeast1
gcloud init      

// Switch over your credentials to point to the asia-northeast1
gcloud container clusters get-credentials svcp-simplelocation-cluster-asia-ne --zone=asia-northeast1-a

// Then you can deploy as above
