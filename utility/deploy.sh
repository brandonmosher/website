#!/bin/bash

gcloud services enable cloudbuild.googleapis.com

gcloud builds submit --tag gcr.io/${GOOGLE_CLOUD_PROJECT}/website:1.0.0 .

gcloud run deploy --image=gcr.io/${GOOGLE_CLOUD_PROJECT}/monolith:1.0.0 --platform managed --region=us-east1 --allow-unauthenticated
