import { Score, Submission, UUID } from "./database"

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

    /**
     * List of completed/graded submissions
     */
    abstract get gradedList(): Submission[]
    /**
     * If the graded submissions list is not empty
     */
    abstract get hasGradedSubmissions(): boolean
    /**
     * Empties the graded submission list and returns the contents.
     */
    abstract emptyGradedList(): Submission[]
}

export default Grader;