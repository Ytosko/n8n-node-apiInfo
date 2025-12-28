import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';

export class ApiInfo implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Api Info',
        name: 'apiInfo',
        icon: 'file:apiInfo.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Interact with ApiInfo API',
        defaults: {
            name: 'Api Info',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'apiInfoApi',
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
                    const ip = this.getNodeParameter('ip', i) as string;
                    const field = this.getNodeParameter('field', i) as string;

                    let path = `/${ip}`;
                    if (field !== 'all') {
                        path += `/${field}`;
                    }

                    responseData = await this.helpers.requestWithAuthentication.call(this, 'apiInfoApi', {
                        method: 'GET',
                        uri: `https://ipinfo.io${path}`,
                        json: true,
                    });
                }

                if (Array.isArray(responseData)) {
                    returnData.push.apply(returnData, responseData as INodeExecutionData[]);
                } else if (responseData !== undefined) {
                    returnData.push({ json: responseData } as INodeExecutionData);
                }
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: (error as Error).message } });
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
