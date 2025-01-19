# strAIght
This is a posture detection site based on TensorflowJS. Flask is used for the backend.
A model for keypoint detection is used to extract keypoint data which is fed into a binary classification model to catagorise as good or bad posture. The site was previously built with boundaryML BAML and ChatGPT 4o to detect and assign posture scores, but I found that to be too inaccurate and cost many credits. The new approach is local and can run even on phones.

