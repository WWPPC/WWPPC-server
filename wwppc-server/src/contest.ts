// Copyright (C) 2024 Sampleprovider(sp)
import database, { Problem } from "./database";
import { Submission } from "./database";
import { Score } from "./database";
import Logger from "./log";
import Database from "./database";
export class ContestManager {
    private logger: Logger = new Logger();
    // private database: Database = new Database("tempURL", "tempKey", this.logger);
    problemCache: Array<Array<Problem>> | undefined;
    roundNum = 0;
    static readonly FILE_SIZE_CAP = 1e4; 
    // all socketio connections are put here (IN A SET NOT AN ARRAY)
    // start/stop rounds, control which problems are where
    // uses database to get problems and then caches them
    // also prevent people from opening the contest page multiple times
    // remember to prevent large file submissions (over 10kb is probably unnecessarily large for these problems)

    //Added submission structure with file size cap
    //Added problem cache

    //TODO: Create round blocks, add socket io and single connection
    
    /**
     * 
     * @param username Username of submitter for database purposes
     * @param problem Problem the sumbission is for
     * @param file File submission
     */

    async getNextRound(division: string){
        this.roundNum++;
        // let stuff: Array<Problem> = await this.database.readProblems({id: "*", division: division, round: this.roundNum.toString(), number: "*", name: "*", author: "*", constraints: constraints => {return true}});
        // this.problemCache?.push(stuff);
        // return stuff;
    }

    async getRound(division: string, round: number){
        if(this.problemCache?.length === undefined){
            this.getNextRound(division);
        }
        // @ts-ignore
        while(this.problemCache?.length <= round){
            this.getNextRound(division);
        }
        return this.problemCache?.at(round);
    }

    async submitFile(username: string, problem: Problem, file: File) : Promise<boolean>{
        if(file.size > ContestManager.FILE_SIZE_CAP){
            return false;
        }

        const scores: Score[] = this.scoreSubmission(problem, file)
        const s: Submission = {username: username, division: problem.division, round: problem.round, number: problem.number, time: Date.now(),
            file: await file.text(), lang: this.getLang(file), scores: scores};
        // this.database.writeSubmission(s);
        return true;
    }

    public scoreSubmission(problem: Problem, file: File) {
        //SUVANTH DO DOMJUDGE
        return [];
    }

    public getLang(file: File) : string{
        //do we use domjudge for this?
        return "";
    }



}

export default ContestManager;