import { RAGApplicationBuilder} from '@llm-tools/embedjs';
import {HNSWDb} from '@llm-tools/embedjs/vectorDb/hnswlib';
import fs from 'fs';
import path, { dirname } from 'path';


import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export class VectorEmbedService{
    email = null;
    filename = null;
    ragApp = null;
    count = 0;
    loaded = 0;
    fileList = [];

    constructor(email) {
        this.email = email;
        this.uploadPath = path.join(__dirname, 'data', 'uploads', email);
        this.supportedExtensions = ['.txt', '.md', '.pdf']; // Define all supported file extensions here
        this.filesList = this.loadFilesFromDirectory();
        this.count = this.filesList.length;
        this.ragApp = new RAGApplicationBuilder();
    }
 

    async buildDocsAsync(){

        for(let i=0;i<this.filesList.length;i++){
            this.loaded = i + 1;
            var file = this.filesList[i];
            await this.ragApp.addLoad(file);
        } 

        this.ragApp.setVectorDb(new HNSWDb())
        .build();
    }

    loadFilesFromDirectory() {
        let filesList = [];
        if (fs.existsSync(this.uploadPath)) {
            filesList = fs.readdirSync(this.uploadPath)
                .filter(file => this.supportedExtensions.includes(path.extname(file)))
                .map(file => path.join(this.uploadPath, file));
        }
        return filesList;
    }

    async query(text){
        try{
            var result = await this.ragApp.query(text);
            return [null, result];
        }catch(ex){
            return ["Error in query", null];
        };
   } 

    destroy(){
        if(this.ragApp)
        {
            this.ragApp = null;
        }
    }

}
