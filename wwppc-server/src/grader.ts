import { Submission } from './database';
import { UUID } from './util';

export abstract class Grader {
    /**
     * Add a submission to the ungraded queue of submissions.
     * @param {GraderSubmission} submission New submission
     */
    abstract queueUngraded(submission: Submission, cb?: (graded: Submission | null) => any);
    /**
     * Cancel all ungraded submissions from a user to a problem.
     * @param username Username of submitter
     * @param problemId ID or problem
     */
    abstract cancelUngraded(username: string, problemId: UUID): boolean;
}

export default Grader;