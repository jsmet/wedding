
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Wedding.Interfaces;

namespace Wedding.Services
{
    public class PhotoService : IPhotoService
    {
        private static string _conn;


        public PhotoService(string conn)
        {
            _conn = conn;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public async Task<List<string>> GetContainerNames()
        {
            List<string> results = new List<string>();
            BlobContinuationToken continuationToken = null;
            CloudStorageAccount storageAccount = null;            

            if (CloudStorageAccount.TryParse(_conn, out storageAccount))
            {
                var blobClient = storageAccount.CreateCloudBlobClient();

                var containers = await blobClient.ListContainersSegmentedAsync(continuationToken);

                foreach (var container in containers.Results)
                {
                    results.Add(container.Name);
                }
            }

            return results; 
        }

        public async Task<List<string>> GetContainerFiles(string container)
        {
            CloudStorageAccount storageAccount = null;
            List<string> results = new List<string>();

            if (CloudStorageAccount.TryParse(_conn, out storageAccount))
            {
                var blobClient = storageAccount.CreateCloudBlobClient();
                var cloudBlobContainer = blobClient.GetContainerReference(container);
                var directory = cloudBlobContainer.GetDirectoryReference(container);

                BlobContinuationToken blobContinuationToken = null;
                do
                {
                    var blobs = await cloudBlobContainer.ListBlobsSegmentedAsync(null, blobContinuationToken);
                    // Get the value of the continuation token returned by the listing call.
                    blobContinuationToken = blobs.ContinuationToken;
                    foreach (IListBlobItem item in blobs.Results)
                    {
                        results.Add(item.Uri.ToString());
                    }
                } while (blobContinuationToken != null); // Loop while the continuation token is not null.
            }

                return results;
        }

    }
}
