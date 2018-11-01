
using Microsoft.AspNetCore.Mvc;
using Services;
using System.Threading.Tasks;
using Wedding.Models;

namespace Wedding.Controllers
{
    [Route("api/[controller]")]
    public class RSVPController : Controller
    {

        private IRsvpService _repo;

        public RSVPController(Services.IRsvpService repo)
        {
            _repo = repo;
        }

        [Produces("application/json")]
        [HttpGet]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _repo.GetRsvp(id);

            if (result != null)
            {
                return Ok(result);
            } else
            {
                return BadRequest();
            }
        }

        [Produces("application/json")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ConfirmRsvp request)
        {
            var result = await _repo.ConfirmRsvp(request);

            return Ok();
        }
    }
}
