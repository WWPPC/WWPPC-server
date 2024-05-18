import { Submission } from './database';

export abstract class Grader {
    /**
     * Queue a submission to be judged
     * @param {Submission} submission submission data
     * @returns {boolean} whether `submission` was successfully pushed to the queue
     */
    // abstract queueSubmission(submission: Submission): boolean

    /**
     * Get all graded submissions that were not seen since last call to this method
     * @returns {Submission[]} submission data
     */
    // abstract getNewGradedSubmissions(): Submission[]

    /**
     * Judge a submission and return it.
     * @param {Submission} submission submission to be judged
     * @returns {Submission} `submission`, but now with judge results. If `submission.scores` is nonempty nothing will happen and `submission` will be returned.
     */
    // judgeSubmission(submission: Submission): Promise<Submission>

    //Maybe we should move judgeSubmission() to the Grader class, rather than it being in ContestManager?
}

export default Grader;