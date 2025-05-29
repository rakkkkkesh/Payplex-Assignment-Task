const Page = require('../Models/PageModel');
const path = require('path');
const fs = require('fs');

const createPage = async (req, res) => {
  try {
    const { mailId, contact, header, text, address, isActive } = req.body;

    if (!req.files || !req.files.logo || !req.files.bannerImage) {
      return res.status(400).json({ message: 'Logo and Banner Image are required' });
    }

    const logo = '/uploads/' + req.files.logo[0].filename;
    const bannerImage = '/uploads/' + req.files.bannerImage[0].filename;

    const page = new Page({
      mailId,
      contact,
      header,
      text,
      address,
      isActive: isActive !== undefined ? isActive : true,
      logo,
      bannerImage,
    });

    await page.save();
    res.status(201).json(page);
  } catch (error) {
    console.error('Create page error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllPages = async (req, res) => {
  try {
    const pages = await Page.find();
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getPageById = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updatePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });

    const { mailId, contact, header, text, address, isActive } = req.body;

    // Update fields
    page.mailId = mailId;
    page.contact = contact;
    page.header = header;
    page.text = text;
    page.address = address;
    page.isActive = isActive !== undefined ? isActive : page.isActive;

    // Handle logo file update
    if (req.files && req.files.logo) {
      // Delete old logo file
      if (page.logo) {
        const oldLogoPath = path.join(__dirname, '../', page.logo);
        if (fs.existsSync(oldLogoPath)) fs.unlinkSync(oldLogoPath);
      }
      page.logo = '/uploads/' + req.files.logo[0].filename;
    }

    // Handle banner image update
    if (req.files && req.files.bannerImage) {
      // Delete old banner image file
      if (page.bannerImage) {
        const oldBannerPath = path.join(__dirname, '../', page.bannerImage);
        if (fs.existsSync(oldBannerPath)) fs.unlinkSync(oldBannerPath);
      }
      page.bannerImage = '/uploads/' + req.files.bannerImage[0].filename;
    }

    await page.save();
    res.json(page);
  } catch (error) {
    console.error('Update page error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deletePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });

    // Delete logo file
    if (page.logo) {
      const logoPath = path.join(__dirname, '../', page.logo);
      if (fs.existsSync(logoPath)) fs.unlinkSync(logoPath);
    }

    // Delete banner image file
    if (page.bannerImage) {
      const bannerPath = path.join(__dirname, '../', page.bannerImage);
      if (fs.existsSync(bannerPath)) fs.unlinkSync(bannerPath);
    }

    await page.deleteOne();

    res.json({ message: 'Page deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const toggleStatus = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });

    page.isActive = !page.isActive;
    await page.save();

    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createPage,
  getAllPages,
  getPageById,
  updatePage,
  deletePage,
  toggleStatus,
};