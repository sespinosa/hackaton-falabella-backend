import Recastai from '../helpers/Recastai'

const instruction = (req, res) => {
  const instruction_text = req.body.instruction

  const recast = new Recastai()

  recast.requestIntencion(instruction_text)
    .then((r) => {
      res.json(r)
    })

}



export default { instruction }