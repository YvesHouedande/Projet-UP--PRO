import os

def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return "user_{0}/{1}".format(instance.public_id, filename)


def get_upload_path(instance, filename):
    # Define the upload path based on content type
    if instance.content_type == "video":
        return os.path.join('publications', 'video', filename)
    elif instance.content_type == "audio":
        return os.path.join('publications', 'audio', filename)
    else:
        return os.path.join('publications', 'other', filename)