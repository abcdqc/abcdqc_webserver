# abcdqc_webserver
This is one of the projects from the NCBI collaborative biodata science hackathon [http://biohackathons.github.io]. Our group is working on a project to automatically QC the [ABCD study data](https://data-archive.nimh.nih.gov/abcd). [Here](https://docs.google.com/presentation/d/1SSinOI-IDNTdZreTARghN799z-Oi2Bn-H6-xFGCnIVc/edit?usp=sharing) is a copy of our initial presentation. 

This project is composed of three github repos ([abcdqc_webserver](https://github.com/abcdqc/abcdqc_webserver), [abcdqc_batchserver](https://github.com/abcdqc/abcdqc_batchserver), [abcdqc_hcp_notebooks](https://github.com/abcdqc/abcdqc_hpc_notebooks)) that work on two AWS instances and utilize the NIH high performance computing cluster. 

![ABCDQC Project Schematic](https://raw.githubusercontent.com/abcdqc/abcdqc_batchserver/bd637699f54891a2556c20f1a52cda67324811ad/ABCDQCflowchart.png "Project Schematic")

This repo contain the code running the NGNIX webserver on the AWS client that serves the interactive visualizations from http://abcdqc.org

Install instructions are being written:

Develop on Web Client (requires node)
----------------------
 * cd abcd-client
 * npm i
 * npm start
