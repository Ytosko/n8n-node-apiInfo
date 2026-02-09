import {
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class ApiInfoApi implements ICredentialType {
    name = 'ipInfoApi';
    displayName = 'IPinfo API';
    documentationUrl = 'https://ipinfo.io/developers';
    properties: INodeProperties[] = [
        {
            displayName: 'Access Token',
            name: 'accessToken',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
        },
    ];
}
