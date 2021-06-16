import { Component } from '@angular/core';
import * as Uppy from '@uppy/core';
import * as Tus from '@uppy/tus';
import * as Dashboard from '@uppy/dashboard';


export const LIMIT_150GB = 161061191137;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'browser';
  private uppy: Uppy.Uppy = null;



  onClick() {
    this.initializeUppy('http://localhost:1080/files/', ['.rtf', '.png', '.mp4']);
    this.openModal();
  }

  private openModal() {
    (this.uppy.getPlugin('ModalDashboard') as Dashboard).openModal();
  }

  private initializeUppy(uploaderURL: string, allowedFileTypes: string[]): void {
    console.log('init uppy');

    const uppyOptions = {
      autoProceed: true,
      // allowMultipleUploads: true,
      // restrictions: {
      //   maxFileSize: LIMIT_150GB,
      //   maxTotalFileSize: LIMIT_150GB,
      //   maxNumberOfFiles: 100,
      //   allowedFileTypes,
      // },
      // meta: {
      //   relativePath: 'xxxx',
      // },
      logger: (Uppy as any).debugLogger,
      //locale: German,
      // onBeforeFileAdded: (currentFile: Uppy.UppyFile, files: any) => {
      //   return true; //this.onBeforeFileAdded(currentFile, files);
      // },
    };

    const tusOptions = {
      endpoint: `${uploaderURL}`,
      resume: true,
      removeFingerprintOnSuccess: true,
      autoRetry: true,
      retryDelays: [0, 1000, 3000, 5000, 10000],
      chunkSize: 5_242_880, // 5MB
      limit: 1,
    };

    const dashboardOptions = {
      id: 'ModalDashboard',
      inline: false,
      showLinkToFileUploadResult: false,
      showProgressDetails: true,
      showRemoveButtonAfterComplete: false,
      proudlyDisplayPoweredByUppy: false,
      hideProgressAfterFinish: false,
      allowMultipleUploads: true,
      //closeAfterFinish: true,
      disableThumbnailGenerator: true,
    };

    // const filesAddedOptions = {
    //   filesService: this.filesService,
    //   fileCreated: this.filesCreated,
    // };

    if (this.uppy) {
      this.uppy.setOptions(uppyOptions);
      this.uppy.getPlugin('Tus').setOptions(tusOptions);
      this.uppy.getPlugin('ModalDashboard').setOptions(dashboardOptions);

      return;
    }

    const uppy = new Uppy.Uppy(uppyOptions);

    this.uppy = uppy;

    // Plugins
    uppy.use(Tus, tusOptions);
    uppy.use(Dashboard, dashboardOptions);
    //uppy.use(FilesAddedPlugin, filesAddedOptions);
    /*
    uppy.on('file-added', (file: Uppy.UppyFile) => {
      // TODO: handle race condition
      console.log('onFileAdd', file);
      this.fileAdded.next({
        uppy,
        file,
      });
    });

    uppy.on('files-added', (files: Uppy.UppyFile[]) => {
      // TODO: handle race condition
      console.log('onFilesAdd', files);

      this.filesAdded.next({
        uppy,
        files,
      });
    });

    uppy.on('upload', data => {
      console.log('onFileUpload', data);
      // insert metadata
      this.fileUploading.next(data);
    });

    uppy.on('complete', result => {
      console.log('uploadResult', result);
      this.fileUploaded.next({
        uppy,
        result,
      });
      this.onRunningUploadDone((result as any).uploadID);
    });
    uppy.on('restriction-failed', (file, error: Error) => {
      console.log('restriction failed', file, error, state.upload.id);
      this.runningUploads.forEach(runningUpload => console.log('running upload!', runningUpload));
      this.uploadErrors.add(state.upload.id);
      this.snackbar.addToQueue(`Datei ${file.data.name} konnte nicht hochgeladen werden: ${error.message}`, 'Okay');
    });
    */

  }

}
