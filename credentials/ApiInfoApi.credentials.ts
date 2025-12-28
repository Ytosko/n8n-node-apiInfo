import {
    IAuthenticateGeneric,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class ApiInfoApi implements ICredentialType {
    name = 'apiInfoApi';
    displayName = 'Api Info API';
    documentationUrl = 'https://ipinfo.io/developers';
    properties: INodeProperties[] = [
        {
            displayName: 'Access Token',
            name: 'accessToken',
            type: 'string',
            default: '',
        },
    ];
    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            qs: {
                token: '={{$credentials.accessToken}}',
            },
        },
    };
}
