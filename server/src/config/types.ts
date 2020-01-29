const TYPES = {
    string: Symbol.for("String"),

    S3: Symbol.for("S3"),
    S3Interface: Symbol.for("S3Interface"),

    DDB: Symbol.for("DynamoDB"),
    DDBProxy: Symbol.for("DynamoDbInterface"),

    UploadResumeHandler: Symbol.for("UploadResumeHandler"),
    SignUpHandler: Symbol.for("SignUpHandler"),
    ResumeLinkRequestHandler: Symbol.for("ResumeLinkRequestHandler"),
    RemoveResumeHandler: Symbol.for("RemoveResumeHandler"),
    RecruiterProfileHandler: Symbol.for("UserProfiles"),

    KeyGen: Symbol.for("KeyGen")
};

export { TYPES };