import { BackUpFileService } from '../../service/BackUpFileService';
import cron from 'node-cron';
const fileService = new BackUpFileService();
const initScheduledJobs = () => {
  const autoDelUnsafeFiles = cron.schedule('*/2 * * * *', async () => {
    console.log('running a task every minute');
    await fileService.autoDeleteUnsafeFiles();
    
  });
  autoDelUnsafeFiles.start();
}

export default initScheduledJobs;