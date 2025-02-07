<?php

namespace App\Controller;

use App\Entity\Product;
use App\Form\ProductType;
use App\Repository\ProductRepository;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/admin/product")
 * @IsGranted("ROLE_ADMIN")
 */
class ProductAdminController extends AbstractController
{
    /**
     * @Route("/", name="product_admin_index", methods={"GET"})
     */
    public function index(ProductRepository $productRepository, Request $request): Response
    {
        $template = $request->query->get('ajax') ? '_list.html.twig' : 'index.html.twig';

        return $this->render('product_admin/' . $template, [
            'products' => $productRepository->findBy([], ['id' => 'DESC']),
        ]);
    }

    /**
     * @Route("/new", name="product_admin_new", methods={"GET","POST"})
     */
    public function new(Request $request): Response
    {
        $product = new Product();
        $form = $this->createForm(ProductType::class, $product, [
            'action' => $this->generateUrl('product_admin_new')
        ]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($product);
            $entityManager->flush();

            if ($request->isXmlHttpRequest()) {
                return new Response(null, 204);
            }

            return $this->redirectToRoute('product_admin_index');
        }

        $template = $request->isXmlHttpRequest() ? '_form.html.twig' : 'new.html.twig';

        return $this->renderForm('product_admin/' . $template, [
            'product' => $product,
            'form' => $form,
            'formTarget' => $request->headers->get('Turbo-Frame', '_top')
        ]);
    }

    /**
     * @Route("/{id}/edit", name="product_admin_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, Product $product): Response
    {
        $form = $this->createForm(ProductType::class, $product, [
            'action' => $this->generateUrl('product_admin_edit', [
                'id' => $product->getId()
            ]),
        ]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('app_product', [
                'id' => $product->getId()
            ]);
        }

        return $this->render('product_admin/edit.html.twig', [
            'product' => $product,
            'form' => $form->createView(),
            'formTarget' => $request->headers->get('Turbo-Frame', '_top')
        ], new Response(null, $form->isSubmitted() && !$form->isValid() ? 422 : 200));
    }

    /**
     * @Route("/{id}", name="product_admin_delete", methods={"POST"})
     */
    public function delete(Request $request, Product $product): Response
    {
        if ($this->isCsrfTokenValid('delete'.$product->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($product);
            $entityManager->flush();
        }

        return $this->redirectToRoute('product_admin_index');
    }
}
