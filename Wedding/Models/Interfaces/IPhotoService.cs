
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Wedding.Interfaces
{
    public interface IPhotoService
    {
        Task<List<string>> GetContainerNames();
        Task<List<string>> GetContainerFiles(string container);
    }
}
