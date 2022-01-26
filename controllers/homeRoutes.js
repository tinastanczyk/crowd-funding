const router = require('express').Router();
const { User, Project } = require('../models');
// TODO: Import the custom middleware
const withAuth = require('../utils/auth');

// GET all projects for homepage
router.get('/', async (req, res) => {
  try {
    const dbProjectData = await Project.findAll({
      include: [
        {
          model: User,
          attributes: ['name', 'id'],
        },
      ],
    });

    const projects = dbProjectData.map((project) =>
      project.get({ plain: true })
    );

    res.render('homepage', {
      projects,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET one project
// TODO: Replace the logic below with the custom middleware
router.get('/project/:id', withAuth, async (req, res) => {
  // If the user is not logged in, redirect the user to the login page
    // If the user is logged in, allow them to view the gallery
    try {
      const dbProjectData = await Project.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: [
              'id',
              'name',
            ],
          },
        ],
      });
      const project = dbProjectData.get({ plain: true });
      res.render('project', { project, loggedIn: req.session.loggedIn });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});

// GET one profile
// TODO: Replace the logic below with the custom middleware
router.get('/profile', withAuth, async (req, res) => {
  // If the user is not logged in, redirect the user to the login page
    // If the user is logged in, allow them to view the painting
    try {
      const dbProfileData = await User.findByPk(req.session.user_id);

      const user = dbProfileData.get({ plain: true });

      res.render('profile', { user, loggedIn: req.session.loggedIn });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;
