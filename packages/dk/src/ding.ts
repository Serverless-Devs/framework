import axios from 'axios';
import crypto from 'crypto';

interface LinkOptions {
    title: string,
    text: string,
    messageUrl: string,
    picUrl: string
}

interface ActionCardSingle {
    title: string,
    text: string,
    btnOrientation : '0' | '1',
    singleTitle: string,
    singleURL: string
}

interface Btn {
    title: string,
    actionURL: string
}

interface ActionCardBtns {
    title: string,
    text: string,
    btnOrientation : '0' | '1',
    btns: Btn[]
}

type ActionCardOptions = ActionCardSingle | ActionCardBtns

type DtalkOptions = {
    webhook: string,
    secret: string,
}

type AtOptions = {
    atMobiles: string[],
    atUserIds: string[]
}

interface FeedCard {
    title: string,
    messageURL: string,
    picURL: string
}

type FeedCardOptions = FeedCard[]

//参考：https://developers.dingtalk.com/document/robots/customize-robot-security-settings
const sign = (webhook: string, secret: string): string => {
    const timestamp = new Date().getTime()
    const stringToSign = `${timestamp}\n${Buffer.from(secret, 'utf8')}`
    const stringToSignEnc = Buffer.from(stringToSign, 'utf8')
    const hmac = crypto.createHmac('sha256',  stringToSignEnc).digest().toString('base64');
    const signCode = encodeURIComponent(hmac)
    return webhook + '&timestamp=' + timestamp + '&sign=' + signCode
}

export class DtalkRobot {
    webhook: string
    constructor(options: DtalkOptions){
        if(typeof options === 'string'){
            this.webhook = options
        }else if(typeof options === 'object'){
            this.webhook = sign(options.webhook, options.secret)
        }
    }


    send(content: any){
        return axios(this.webhook, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            data: JSON.stringify(content)
          });
    }


    sendText(content:string)
    sendText(content:string, atAll: boolean)
    sendText(content:string, ats:  AtOptions)
    sendText(content:string, at?: boolean | AtOptions){
        const base = {
            msgtype:'text',
            text:{
                content
            }
        }
        if(typeof at === 'undefined'){
            return this.send({
                ...base
            })
        }else if(typeof at === 'boolean'){
            return this.send({
                ...base,
                at:{
                    isAtAll:at
                }
            })
        }else if(typeof at === 'object'){
            return this.send({
                ...base,
                at:{
                    ...at
                }
            })
        }
    }

    sendLink(options: LinkOptions){
        return this.send({
            msgtype:'link',
            link:options
        })
    }

    sendMd(title: string, text: string)
    sendMd(title: string, text: string, atAll: boolean)
    sendMd(title: string, text: string, ats:  AtOptions)
    sendMd(title: string, text: string, at?: boolean | AtOptions){
        const base = {
            msgtype:'markdown',
            markdown:{
                title,
                text
            }
        }
        if(typeof at === 'undefined'){
            return this.send({
                ...base
            })
        }else if(typeof at === 'boolean'){
            return this.send({
                ...base,
                at:{
                    isAtAll:at
                }
            })
        }else if(typeof at === 'object'){
            return this.send({
                ...base,
                at:{
                    ...at
                }
            })
        }
    }

    sendActionCard(options: ActionCardOptions){
        return this.send({
            msgtype:'actionCard',
            actionCard:{
                ...options
            }
        })
    }

    sendFeedCard(options: FeedCardOptions){
        return this.send({
            msgtype:'feedCard',
            feedCard:{
                links: options
            }
        })
    }
}

