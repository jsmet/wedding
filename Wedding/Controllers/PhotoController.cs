
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Wedding.Interfaces;

namespace Wedding.Controllers
{
    [Route("api/[controller]")]
    public class PhotoController : Controller
    {
        private IPhotoService _repo;

        public PhotoController(Services.PhotoService repo)
        {
            _repo = repo;
        }

        [Produces("application/json")]
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var result = await _repo.GetContainerNames();

            return Ok(result);
        }

        [Produces("application/json")]
        [HttpGet("{container}")]
        public async Task<IActionResult> Get(string container)
        {
            var result = await _repo.GetContainerFiles(container);

            return Ok(result);
        }
    }
}