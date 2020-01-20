export interface MessageInterface {
    from: string;
    message: string;
    date?: string;
    seen?: string[];
}

export interface ConversationInterface {
    members: string[];
    messages: MessageInterface[];
}
