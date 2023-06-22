# Write-Up

I added social media sharing buttons and added a new file feature to this project. The reason is, this feature is very useful for Multimedia Applications. We can add a new file and then share it on our social media, I think is pretty cool.

## Social Media Share Button

You can share file into social media.

* Select the file that you want to share.
* Click on the social media button in the preview section. There are 4 options to share your file (Facebook, Twitter, WhatsApp, or Telegram).

Code work:

I'm using `react-share` library to add a share button in this project. I add this feature at the bottom of the preview file section.

```javascript
<div style={styles.btnShare}>
    <FacebookShareButton url={window.location.href + selectedFile.path.substring(1)} quote={selectedFile.name}>
    <FacebookIcon size={24} round={true} />
    </FacebookShareButton>
    <TwitterShareButton url={window.location.href + selectedFile.path.substring(1)} title={selectedFile.name}>
    <TwitterIcon size={24} round={true} />
    </TwitterShareButton>
    <WhatsappShareButton url={window.location.href + selectedFile.path.substring(1)} title={selectedFile.name}>
    <WhatsappIcon size={24} round={true} />
    </WhatsappShareButton>
    <TelegramShareButton url={window.location.href + selectedFile.path.substring(1)} title={selectedFile.name}>
    <TelegramIcon size={24} round={true} />
    </TelegramShareButton>
</div>
```

## Add New File

You can add a new file with a maximum size of 5 MB.

* To add a new file you can click `Add File` button.
* Then select the file that you want to upload.
* And now your file will appear in the last item in the list.

> This is just a temporary file, when you refresh the page it will disappear.

Code work:

After selecting the file to be added, the system will ensure the file size is not more than 5 MB. If the file size is more than 5 MB, a message will appear that the file is too large. And if the file size is less than 5 MB then the file will be added to the file list.

```javascript
const handleNewFile = (event) => {
    if (event.target.files[0].size / 1024 <= 5120) {
        const reader = new FileReader()
        const file = event.target.files[0]
        const type = file.type.split('/')[0]
        const name = file.name.split('.')[0] + ' (NEW)'
        reader.readAsDataURL(file)
        reader.addEventListener("load", () => {
        if (reader.result) {
            const newFile = {
            id: currentId + 1,
            name,
            type,
            path: reader.result
            }
            currentId += 1
            const newArray = [...myFiles, newFile]
            setMyFiles(newArray)
        } else {
            alert("Ooops, something went wrong")
        }
        })
    } else {
        alert("File size is too large " + event.target.files[0].size / 1024)
    }
}
```
