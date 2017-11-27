import { router } from './index';
import { MessageBox } from 'mint-ui';

export default {
  rStartDialog:() => {
    MessageBox({
      title:'错误',
      message: '服务器出错了',
      showConfirmButton: true
    }).then( res => {
      router.push({path: '/'});
    })
  }
}