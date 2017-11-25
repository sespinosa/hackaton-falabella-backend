import request from 'request'

const IMAGE_API_URL = (id, w=500, h=500) => (
  `http://falabella.scene7.com/is/image/Falabella/${id}?wid=${w}&hei=${h}&crop=0,0,0,0`
)

const load = (req, res, next, id) => {
  req.image_url = IMAGE_API_URL(id, req.query.w, req.query.h)
  next()
}

const get = (req, res) => {
  request(req.image_url).pipe(res)
}



export default { load, get }