import {Template} from 'meteor/templating'

import './layout.html'

Template.AdminLayout.onCreated(function () {
  const instance = this

  instance.minHeight = new ReactiveVar(
    $(window).height() - $('.main-header').height())

  $(window).resize(function () {
    instance.minHeight.set($(window).height() - $('.main-header').height())
  })

  $('body').addClass('fixed')
})

Template.AdminLayout.onDestroyed(function () {
  $('body').removeClass('fixed')
})

Template.AdminLayout.helpers({
  minHeight: function () {
    return Template.instance().minHeight.get() + 'px'
  }
})

dataTableOptions = {
  'aaSorting': [],
  'bPaginate': true,
  'bLengthChange': false,
  'bFilter': true,
  'bSort': true,
  'bInfo': true,
  'bAutoWidth': false
}
