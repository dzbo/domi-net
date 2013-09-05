$(function() {

  // section heights
  var bHeight = $(window).height();
  if (bHeight > 400) {
    $('section:first-of-type').css('minHeight', bHeight - $('header').height());
    $('section:last-of-type').css('minHeight', bHeight - ($('footer').height() + $('#navbar').height() + -1));
    $('section:not(section:first-of-type):not(section:last-of-type)').css('minHeight', bHeight);
  }

  // contact map
  load_map("<b>Domi-Net</b><br />ul.Kwiatkowskiego 7/38, Częstochowa, Poland", 50.82805, 19.10644);

});
