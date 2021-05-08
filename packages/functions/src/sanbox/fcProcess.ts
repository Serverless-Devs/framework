import { IContext, IRequest, IResponse } from '../providers/interface';

interface IFcProcessParams {
  event?: any;
  context: IContext;
  req?: IRequest;
  resp?: IResponse;
  initializerHandler?: Function;
  entryHandler?: Function;
  triggerType: 'http';
}

export default (params: IFcProcessParams) => {
  const { event, context, req, resp, initializerHandler, entryHandler, triggerType } = params;
  initializerHandler(context, (error, result) => {
    if (error) {
      console.log(error);
      return;
    }
    triggerType === 'http'
      ? entryHandler(req, resp, context)
      : entryHandler(event, context, () => {
          return 'success';
        });
  });
};
