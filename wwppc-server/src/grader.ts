import { Score, UUID } from "./database"

/**Submissions as used by the grading system */
export interface GraderSubmission {
    /**Username of submitter */
    readonly username: string
    /**UUID of problem submitted to */
    readonly problemId: UUID
    /**Time of submission, UNIX milliseconds */
    time: number
    /**Contents of the submission file */
    file: string
    /**Submission language */
    lang: string
}
/**Submissions as used by the grading system */
export interface GraderSubmissionComplete extends GraderSubmission {
    /**Username of submitter */
    readonly username: string
    /**UUID of problem submitted to */
    readonly problemId: UUID
    /**Time of submission, UNIX milliseconds */
    time: number
    /**Contents of the submission file */
    file: string
    /**Submission language */
    lang: string
    /**Resulting scores of the submission */
    scores: Score[]
}

export abstract class Grader {
    /**
     * Add a submission to the ungraded queue of submissions.
     * @param {GraderSubmission} submission New submission
     */
    abstract queueUngraded(submission: GraderSubmission);
    /**
     * Cancel all ungraded submissions from a user to a problem.
     * @param username Username of submitter
     * @param problemId ID or problem
     */
    abstract cancelUngraded(username: string, problemId: UUID): Promise<void>;

    /**
     * List of completed/graded submissions
     */
    abstract get gradedList(): GraderSubmissionComplete[]
    /**
     * If the graded submissions list is not empty
     */
    abstract get hasGradedSubmissions(): boolean
    /**
     * Empties the graded submission list and returns the contents.
     */
    abstract emptyGradedList(): GraderSubmissionComplete[]
}

export default Grader;