import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { sendETH } from "@goat-sdk/wallet-evm";
import { WalletClientBase } from "@goat-sdk/core";
import { sertifyme } from "@ifachry/plugin-sertifyme";
import {
    generateText,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    ModelClass,
    type State,
    composeContext,
} from "@elizaos/core";

export async function getOnChainActions(wallet: WalletClientBase) {
    const actionsWithoutHandler = [
        // {
        //     name: "SEND_ETH",
        //     description: "Send ETH to an address.",
        //     similes: [],
        //     validate: async () => true,
        //     examples: [],
        // },
        {
            name: "GET_CERT_METADATA",
            description: "get a CERT NFT metadata",
            similes: [],
            validate: async () => true,
            examples: [],
        },
        {
            name: "TRANSFER_CERT",
            description: "transfers a CERT NFT to the specified address",
            similes: [],
            validate: async () => true,
            examples: [],
        },
        {
            name: "MINT_CERT",
            description: "mint a CERT NFT to the specified address",
            similes: [],
            validate: async () => true,
            examples: [],
        },
        // 1. Add your actions here
    ];

    const tools = await getOnChainTools({
        wallet: wallet,
        // 2. Configure the plugins you need to perform those actions
        plugins: [
            // sendETH(),
            sertifyme({
                tokens: [
                    {
                        symbol: "CERT",
                        name: "CertificationNFT",
                        chains: {
                            // "84532": {
                            //     contractAddress:
                            //         "0xfd71381b49CA874D269eE45A84f25744a3F9433C",
                            // },
                            "919": {
                                contractAddress:
                                    "0x462B9bE8180d84A01587492C2317cE8A084535F7",
                            },
                        },
                    },
                ],
            }),
            // erc721({
            //     tokens: [
            //         {
            //             symbol: "CERT",
            //             name: "CertificationNFT",
            //             chains: {
            //                 // "84532": {
            //                 //     contractAddress:
            //                 //         "0xfd71381b49CA874D269eE45A84f25744a3F9433C",
            //                 // },
            //                 "919": {
            //                     contractAddress:
            //                         "0x462B9bE8180d84A01587492C2317cE8A084535F7",
            //                 },
            //             },
            //         },
            //     ],
            // }),
        ],
    });

    // 3. Let GOAT handle all the actions
    return actionsWithoutHandler.map((action) => ({
        ...action,
        handler: getActionHandler(action.name, action.description, tools),
    }));
}

function getActionHandler(
    actionName: string,
    actionDescription: string,
    tools
) {
    return async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State | undefined,
        options?: Record<string, unknown>,
        callback?: HandlerCallback
    ): Promise<boolean> => {
        let currentState = state ?? (await runtime.composeState(message));
        currentState = await runtime.updateRecentMessageState(currentState);

        try {
            // 1. Call the tools needed
            const context = composeActionContext(
                actionName,
                actionDescription,
                currentState
            );
            const result = await generateText({
                runtime,
                context,
                tools,
                maxSteps: 10,
                // Uncomment to see the log each tool call when debugging
                onStepFinish: (step) => {
                    console.log(step.toolResults);
                },
                modelClass: ModelClass.LARGE,
            });

            // 2. Compose the response
            const response = composeResponseContext(result, currentState);
            const responseText = await generateResponse(runtime, response);

            callback?.({
                text: responseText,
                content: {},
            });
            return true;
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);

            // 3. Compose the error response
            const errorResponse = composeErrorResponseContext(
                errorMessage,
                currentState
            );
            const errorResponseText = await generateResponse(
                runtime,
                errorResponse
            );

            callback?.({
                text: errorResponseText,
                content: { error: errorMessage },
            });
            return false;
        }
    };
}

function composeActionContext(
    actionName: string,
    actionDescription: string,
    state: State
): string {
    const actionTemplate = `
# Knowledge
{{knowledge}}

About {{agentName}}:
{{bio}}
{{lore}}

{{providers}}

{{attachments}}


# Action: ${actionName}
${actionDescription}

{{recentMessages}}

Based on the action chosen and the previous messages, execute the action and respond to the user using the tools you were given.
`;
    return composeContext({ state, template: actionTemplate });
}

function composeResponseContext(result: unknown, state: State): string {
    const responseTemplate = `
    # Action Examples
{{actionExamples}}
(Action examples are for reference only. Do not use the information from them in your response.)

# Knowledge
{{knowledge}}

# Task: Generate dialog and actions for the character {{agentName}}.
About {{agentName}}:
{{bio}}
{{lore}}

{{providers}}

{{attachments}}

# Capabilities
Note that {{agentName}} is capable of reading/seeing/hearing various forms of media, including images, videos, audio, plaintext and PDFs. Recent attachments have been included above under the "Attachments" section.

Here is the result:
${JSON.stringify(result)}

{{actions}}

Respond to the message knowing that the action was successful and these were the previous messages:
{{recentMessages}}
  `;
    return composeContext({ state, template: responseTemplate });
}

function composeErrorResponseContext(
    errorMessage: string,
    state: State
): string {
    const errorResponseTemplate = `
# Knowledge
{{knowledge}}

# Task: Generate dialog and actions for the character {{agentName}}.
About {{agentName}}:
{{bio}}
{{lore}}

{{providers}}

{{attachments}}

# Capabilities
Note that {{agentName}} is capable of reading/seeing/hearing various forms of media, including images, videos, audio, plaintext and PDFs. Recent attachments have been included above under the "Attachments" section.

{{actions}}

Respond to the message knowing that the action failed.
The error was:
${errorMessage}

These were the previous messages:
{{recentMessages}}
    `;
    return composeContext({ state, template: errorResponseTemplate });
}

async function generateResponse(
    runtime: IAgentRuntime,
    context: string
): Promise<string> {
    return generateText({
        runtime,
        context,
        modelClass: ModelClass.SMALL,
    });
}
