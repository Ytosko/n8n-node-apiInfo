import {
    IExecuteFunctions,
    IHttpRequestOptions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    JsonObject,
    NodeApiError,
} from 'n8n-workflow';

enum NodeConnectionType {
    Main = 'main',
}

export class ApiInfo implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Ip Info by Ytosko',
        name: 'ipInfo',
        icon: 'file:apiInfo.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Interact with IPinfo API',
        defaults: {
            name: 'IPinfo',
        },
        inputs: [NodeConnectionType.Main],
        outputs: [NodeConnectionType.Main],
        credentials: [
            {
                name: 'ipInfoApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Info',
                        value: 'info',
                    },
                ],
                default: 'info',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: [
                            'info',
                        ],
                    },
                },
                options: [
                    {
                        name: 'Get',
                        value: 'get',
                        action: 'Get info',
                        description: 'Get information',
                    },
                ],
                default: 'get',
            },
            {
                displayName: 'IP Address',
                name: 'ip',
                type: 'string',
                default: '',
                placeholder: '1.1.1.1',
                description: 'The IP address to lookup',
                displayOptions: {
                    show: {
                        resource: [
                            'info',
                        ],
                        operation: [
                            'get',
                        ],
                    },
                },
            },
            {
                displayName: 'Field',
                name: 'field',
                type: 'options',
                default: 'all',
                description: 'Specific field to retrieve',
                displayOptions: {
                    show: {
                        resource: [
                            'info',
                        ],
                        operation: [
                            'get',
                        ],
                    },
                },
                options: [
                    {
                        name: 'All Details',
                        value: 'all',
                    },
                    {
                        name: 'Organization',
                        value: 'org',
                    },
                    {
                        name: 'City',
                        value: 'city',
                    },
                    {
                        name: 'Country',
                        value: 'country',
                    },
                ],
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][] | null> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];
        const length = items.length;
        let responseData;
        const resource = this.getNodeParameter('resource', 0) as string;
        const operation = this.getNodeParameter('operation', 0) as string;

        for (let i = 0; i < length; i++) {
            try {
                if (resource === 'info' && operation === 'get') {
                    const ip = (this.getNodeParameter('ip', i) as string).trim();
                    const field = this.getNodeParameter('field', i) as string;

                    const credentials = await this.getCredentials('ipInfoApi');
                    const accessToken = (credentials.accessToken as string || '').trim();

                    const baseUrl = 'https://ipinfo.io';
                    // Strip http/https if user pasted it
                    const cleanIp = ip.replace(/^https?:\/\//, '');

                    const u = new URL(`${baseUrl}/${cleanIp}`);

                    if (field !== 'all') {
                        u.pathname += `/${field}`;
                    }

                    if (accessToken) {
                        u.searchParams.append('token', accessToken);
                    }

                    const options: IHttpRequestOptions = {
                        method: 'GET',
                        url: u.toString(),
                        json: field === 'all',
                    };

                    responseData = await this.helpers.httpRequest(options);

                    if (field === 'all') {
                        delete responseData.readme;
                    } else {
                        responseData = { [field]: (responseData as string).trim() };
                    }
                }

                const executionData = this.helpers.constructExecutionMetaData(
                    this.helpers.returnJsonArray(responseData as JsonObject[]),
                    { itemData: { item: i } }
                );

                returnData.push(...executionData);

            } catch (error) {
                if (this.continueOnFail()) {
                    const executionData = this.helpers.constructExecutionMetaData(
                        this.helpers.returnJsonArray({ error: (error as Error).message }),
                        { itemData: { item: i } }
                    );
                    returnData.push(...executionData);
                    continue;
                }
                throw new NodeApiError(this.getNode(), error as JsonObject);
            }
        }
        return [returnData];
    }
}
